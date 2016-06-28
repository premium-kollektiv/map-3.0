
{{ content() }}

<div align="right">
    {{ link_to("product/new", "Create product") }}
</div>

{{ form("product/search", "method":"post", "autocomplete" : "off") }}

<div align="center">
    <h1>Search product</h1>
</div>

<table>
    <tr>
        <td align="right">
            <label for="id">Id</label>
        </td>
        <td align="left">
            {{ text_field("id", "type" : "numeric") }}
        </td>
    </tr>
    <tr>
        <td align="right">
            <label for="name">Name</label>
        </td>
        <td align="left">
            {{ text_field("name", "size" : 30) }}
        </td>
    </tr>
    <tr>
        <td align="right">
            <label for="description">Description</label>
        </td>
        <td align="left">
                {{ text_area("description", "cols": "30", "rows": "4") }}
        </td>
    </tr>

    <tr>
        <td></td>
        <td>{{ submit_button("Search") }}</td>
    </tr>
</table>

</form>
