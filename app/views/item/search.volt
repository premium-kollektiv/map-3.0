
{{ content() }}

<table width="100%">
    <tr>
        <td align="left">
            {{ link_to("item/index", "Go Back") }}
        </td>
        <td align="right">
            {{ link_to("item/new", "Create ") }}
        </td>
    </tr>
</table>

<table class="browse" align="center">
    <thead>
        <tr>
            <th>Id</th>
            <th>Collmex Of Customer</th>
            <th>Name</th>
            <th>Street</th>
            <th>Street Of Number</th>
            <th>Zip</th>
            <th>City</th>
            <th>Country</th>
            <th>Lat</th>
            <th>Lng</th>
            <th>Web</th>
            <th>Email</th>
            <th>Location Of Checked</th>
         </tr>
    </thead>
    <tbody>
    {% if page.items is defined %}
    {% for item in page.items %}
        <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.collmex_customer_id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.street }}</td>
            <td>{{ item.street_number }}</td>
            <td>{{ item.zip }}</td>
            <td>{{ item.city }}</td>
            <td>{{ item.country }}</td>
            <td>{{ item.lat }}</td>
            <td>{{ item.lng }}</td>
            <td>{{ item.web }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.location_checked }}</td>
            <td>{{ link_to("item/edit/"~item.id, "Edit") }}</td>
            <td>{{ link_to("item/delete/"~item.id, "Delete") }}</td>
        </tr>
    {% endfor %}
    {% endif %}
    </tbody>
    <tbody>
        <tr>
            <td colspan="2" align="right">
                <table align="center">
                    <tr>
                        <td>{{ link_to("item/search", "First") }}</td>
                        <td>{{ link_to("item/search?page="~page.before, "Previous") }}</td>
                        <td>{{ link_to("item/search?page="~page.next, "Next") }}</td>
                        <td>{{ link_to("item/search?page="~page.last, "Last") }}</td>
                        <td>{{ page.current~"/"~page.total_pages }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </tbody>
</table>
