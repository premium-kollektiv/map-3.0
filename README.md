# Landkarte

Premium map based on leaflet and openstreetmap tiles

## Run local development server

```sh
vagrant up
```

Now fire up your browser and open http://localhost:8085

Copy `app/config/config.vagrant.default.php` to `app/config/config.php` as a starting point with working database config.

### Restart all over again

```sh
vagrant destroy --force && vagrant up
```

## composer

install dependencies via

```sh
composer i
```

## configuration

copy config template

```sh
cp ./app/config/config.sample.php ./app/config/config.php
```

edit config vars for mysql connection and collmex api connection

```sh
nano ./app/config/config.php
```

## Deploy

Run `rsync -e ssh -rv --exclude='app/config/config.php' app public vendor composer.json composer.lock premium:/var/www/api.landkarte.premium-cola.de/` (replace premium with your access to the prod server) to deploy to production.

## Run collmex sync

```sh
# Fetch new item from collmex database
php app/cli.php update

# Enrich items with geolocation information
php app/cli.php update geo
```

## Add, list, delete products

```sh
# Add new product
php app/cli.php product add "New beverage name" "Beverage description" collmexId

# List all products
php app/cli.php product list

# Delete existing product
php app/cli.php product delete 5
```

## Which data points are published (and which are sorted out)

The map gets its markers from `GET /item/list` (`ItemController::apiListAction`). **A data point is published if, and only if, this endpoint returns it.** Everything else is considered sorted out, no matter whether it is stored in the database or not.

The front-end requests all offer types, products and countries:

```
/item/list?types[]=laeden&types[]=haendler&types[]=sprecher&types[]=webshop&countries[]=DE&countries[]=AT&countries[]=CH&products[]=cola&products[]=bier&products[]=frohlunder&products[]=muntermate
```

With this request, the parts of criteria 4, 5 and 8 below that depend on the request ("was requested via ...") never sort anything out. The criteria then boil down to: the item has at least one offer type, at least one product and a country of `DE`, `AT` or `CH`. They only matter if the front-end lets users narrow down the filter.

An address from Collmex has to pass all of the following criteria, in this order:

| # | Criterion | Enforced by | Sorted out if... |
|---|---|---|---|
| 1 | Record type | `BaseTask::collmexAddressGet` | The Collmex record type is not `CMXADR` |
| 2 | Opt-in | `UpdateTask::mainAction`, `deleteOldEntries` | The address is **not** in Collmex group **124** ("möchte auf die Landkarte") |
| 3 | Still in Collmex | `UpdateTask::deleteOldEntries` | The `address_id` is not returned by Collmex any more |
| 4 | Offer type | `UpdateTask::mapOffertypes`, `ItemController::apiListAction` | The address is in none of the groups **8** (Laden), **9** (Händler), **7** (Sprecher), **112** (Webshop), or none of its offer types was requested via `types` |
| 5 | Product | `Item::listMarker` | The address is in none of the product groups **20** (Cola), **21** (Bier), **29** (Frohlunder), **33** (Muntermate), or none of its products was requested via `products` |
| 6 | Opt-out / former customer | `ItemController::apiListAction` | The address is in Collmex group **93** ("möchte auf eigenen Wunsch nicht auf die Landkarte") or **16** ("ehemalige Kunden"), even if it is also in group 124 |
| 7 | Coordinates | `UpdateTask::geoAction`, `Item::listMarker` | The item has no `lat`/`lng` (see below) |
| 8 | Country | `Item::listMarker` | The Collmex country is not in the requested `countries` (default `DE`, `AT`, `CH`). An empty or other country code is sorted out |

Additionally, `/item/list` returns an empty list if the request has no `types` parameter at all. Valid values for `types` are `laeden`, `haendler`, `sprecher` and `webshop`.

The group ids are hard-coded in `UpdateTask::initialize()`, except for the product groups, which are read from `product.collmex_id`. The sync (`php app/cli.php update`) applies criteria 1–4 when it writes to the database. Criteria 5–8 are checked at request time by the API.

### Coordinates (criterion 7)

Coordinates are looked up via OpenStreetMap Nominatim by `php app/cli.php update geo`.

- Only items with `geolocate_count < 20` are tried. Every attempt increments the counter, whether it succeeds or not. An item that Nominatim cannot find 20 times is given up on and stays sorted out until its street, zip or city changes in Collmex (this resets the counter) or the counter is reset manually in the database.
- Items whose only offer type is *Sprecher* are located by city only.
- An item that has not been geocoded yet (for example right after the first sync) is sorted out until `update geo` has run.

#### Checking whether an address can be located

Anyone with access to the Collmex data can simulate the lookup in a browser, using the same query as `BaseTask::getCoordinatesViaNominatim`:

```
https://nominatim.openstreetmap.org/search.php?format=jsonv2&limit=1&street=STREET+HOUSENUMBER&city=CITY&country=Germany&postalcode=ZIP
```

- `street`: the Collmex street field as is, spaces replaced by `+` (for example `Pariser+Platz+1`).
- `postalcode`: digits only, as the sync strips all other characters from the zip.
- `country`: `Germany` for `DE`, `Austria` for `AT`, `Switzerland` for `CH` (see `BaseTask::countryMapper`).
- For items whose only offer type is *Sprecher*, leave `street=` and `postalcode=` empty, as only the city is used for them.

If the response contains `"lat"` and `"lon"`, the address can be located. If it is just `[]`, Nominatim does not find the address, which is why the item is missing on the map. Typically this is a typo or a missing house number, zip or city, and correcting it in Collmex fixes it. The next sync resets the retry counter for changed addresses.

If the address is found in the browser but is still missing on the map, the lookup in the app may have failed temporarily or given up after 20 attempts. Check `lat`, `lng` and `geolocate_count` of the item in the `item` table. The lookup is meant for occasional manual checks, Nominatim blocks heavy usage.

### Things to know

- **Product names.** The product filter compares the requested names with `product.name` in the database (case-insensitive), so the names the front-end sends (`cola`, `bier`, `frohlunder`, `muntermate`) have to match the product names in the database. They do for the seed data in `docs/database/schema.sql`. Note that the fallback used when `products` is omitted from the request lists `holunder` instead of `frohlunder`, so a request without `products` would never match Frohlunder items.
- **Checks that look like criteria but are not.** The required-fields check in `addressCleanup()` uses `isset()`, so an address with an empty city or zip passes (it will most likely just fail geocoding). The empty-groups check in `checkAddressGroups()` can never trigger either, because `explode()` always returns at least one element. An invalid e-mail address does not sort out an item, the e-mail is just not stored.
- **Other endpoints.** `/item/all`, `/search/<string>` and `/item/<id>` apply fewer checks than `/item/list` (for example none of them looks at groups 16/93, coordinates or country). They are not what the map shows, so they are not relevant for the criteria above.

### Checklist: why is a shop missing on the map?

1. Is the Collmex address in group 124, and *not* in 93 or 16?
2. Does it have at least one offer type group (8, 9, 7, 112) **and** at least one product group (20, 21, 29, 33)?
3. Was `php app/cli.php update` run after the change in Collmex, followed by `php app/cli.php update geo`?
4. Does the item have `lat`/`lng` in the `item` table? If not, check `geolocate_count` (20 = given up) and whether the address is valid.
5. Is the country `DE`, `AT` or `CH`?
6. Does the request really include the item's offer type and product? (The default front-end request includes all of them.)

## Production

### Restore db-backup

```bash
mysql landkarte < /var/backups/rsnapshot/*/mysql/*.sql
```

## Installation on ubuntu-server 16.04

## install phalcon framework

```sh
sudo apt-get install -y gcc make re2c libpcre3-dev php-dev build-essential php-zip
```

### Install composer

```sh
sudo curl -sS http://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### Install zephir

```sh
sudo composer global require "phalcon/zephir:dev-master"
```

### Install phalcon dev tool

```sh
sudo composer require "phalcon/devtools" -d /usr/local/bin/
sudo ln -s /usr/local/bin/vendor/phalcon/devtools/phalcon.php /usr/bin/phalcon
```

### Install phalconphp with php7

```sh
sudo git clone https://github.com/phalcon/cphalcon.git -b 2.1.x --single-branch
cd cphalcon/
sudo ~/.composer/vendor/bin/zephir build --backend=ZendEngine3
sudo echo "extension=phalcon.so" >> /etc/php/7.0/fpm/conf.d/20-phalcon.ini
sudo echo "extension=phalcon.so" >> /etc/php/7.0/cli/conf.d/20-phalcon.ini
```

### restart php-fpm

```sh
sudo service php7.0-fpm restart
```

## Install npm dependencies

```sh
composer install
```
