
{{ form("offertype/create", "method":"post") }}

<table width="100%">
    <tr>
        <td align="left">{{ link_to("offertype", "Go Back") }}</td>
        <td align="right">{{ submit_button("Save") }}</td>
    </tr>
</table>

{{ content() }}

<div align="center">
    <h1>Create offertype</h1>
</div>

<table>
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
        <td>{{ submit_button("Save") }}</td>
    </tr>
</table>

</form>
