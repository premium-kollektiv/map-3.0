
{{ content() }}

<table width="100%">
    <tr>
        <td align="left">
            {{ link_to("offertype/index", "Go Back") }}
        </td>
        <td align="right">
            {{ link_to("offertype/new", "Create ") }}
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
    {% for offertype in page.items %}
        <tr>
            <td>{{ offertype.id }}</td>
            <td>{{ offertype.name }}</td>
            <td>{{ offertype.description }}</td>
            <td>{{ link_to("offertype/edit/"~offertype.id, "Edit") }}</td>
            <td>{{ link_to("offertype/delete/"~offertype.id, "Delete") }}</td>
        </tr>
    {% endfor %}
    {% endif %}
    </tbody>
    <tbody>
        <tr>
            <td colspan="2" align="right">
                <table align="center">
                    <tr>
                        <td>{{ link_to("offertype/search", "First") }}</td>
                        <td>{{ link_to("offertype/search?page="~page.before, "Previous") }}</td>
                        <td>{{ link_to("offertype/search?page="~page.next, "Next") }}</td>
                        <td>{{ link_to("offertype/search?page="~page.last, "Last") }}</td>
                        <td>{{ page.current~"/"~page.total_pages }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </tbody>
</table>
