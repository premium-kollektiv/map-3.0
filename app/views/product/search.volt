
{{ content() }}

<table width="100%">
    <tr>
        <td align="left">
            {{ link_to("product/index", "Go Back") }}
        </td>
        <td align="right">
            {{ link_to("product/new", "Create ") }}
        </td>
    </tr>
</table>

<table class="browse" align="center">
    <thead>
        <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
         </tr>
    </thead>
    <tbody>
    {% if page.items is defined %}
    {% for product in page.items %}
        <tr>
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>{{ link_to("product/edit/"~product.id, "Edit") }}</td>
            <td>{{ link_to("product/delete/"~product.id, "Delete") }}</td>
        </tr>
    {% endfor %}
    {% endif %}
    </tbody>
    <tbody>
        <tr>
            <td colspan="2" align="right">
                <table align="center">
                    <tr>
                        <td>{{ link_to("product/search", "First") }}</td>
                        <td>{{ link_to("product/search?page="~page.before, "Previous") }}</td>
                        <td>{{ link_to("product/search?page="~page.next, "Next") }}</td>
                        <td>{{ link_to("product/search?page="~page.last, "Last") }}</td>
                        <td>{{ page.current~"/"~page.total_pages }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </tbody>
</table>
