from collections import OrderedDict


from dash import Dash, dash_table, html, Output, Input
import dash
import pandas as pd

data = OrderedDict(
    [
        ("Date", ["2015-01-01", "2015-10-24", "2016-05-10", "2017-01-10", "2018-05-10", "2018-08-15"]),
        ("Region", ["__NOT_FOUND", None, "__NOT_FOUND2", "_NOT_LIVE", "San Francisco", "London"]),
        ("Temperature", [1, -20, 3.512, 4, 10423, -441.2]),
        ("Humidity", [10, 20, 30, 40, 50, 60]),
        ("Pressure", [2, 10924, 3912, -10, 3591.2, 15]),
    ]
)

df = pd.DataFrame(data)

app = Dash(__name__)

app.layout = html.Div([
    html.Div(id='div_msg'),
    dash_table.DataTable(
        id='the_table',
        data=df.to_dict('records'),
        sort_action='native',
        filter_action='native',
        columns=[
            {"name": i, "id": i} for i in df.columns
        ],
        style_data_conditional=[
            {
                'if': {
                    'filter_query': '{Region} > "" && !({Region} < "__" || {Region} >= "_`")',
                    'column_id': 'Humidity'
                },
                'backgroundColor': 'tomato',
            },
        ]
    )
])


@dash.callback(
    output={
        'div_msg': Output('div_msg', 'children')
    },
    inputs={
        'active_cell': Input('the_table', 'active_cell'),
    },
    prevent_initial_call=True
)
def on_active_cell_change(active_cell):
    return {
        'div_msg': str(active_cell)
    }


if __name__ == '__main__':
    app.run_server(debug=True, port=5231)
