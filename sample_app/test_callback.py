from dash import Dash, dcc, html, Input, Output
import dash

app = Dash(__name__)

app.layout = html.Div([
    html.H6("Change the value in the text box to see callbacks in action!"),
    html.Div([
        "Input: ",
        dcc.Input(id='my-input', value='initial value', type='text')
    ]),
    html.Div([
        "Input2: ",
        dcc.Input(id='my-input2', type='text')
    ]),
    html.Button('Test', id='btn_test'),
    html.Div(id='my-output'),
    html.Hr(),
    html.Label('output2'),
    html.Div(id='my-output2'),

])


@dash.callback(
    Output(component_id='my-output', component_property='children'),
    [
        Input(component_id='my-input', component_property='value'),
        Input(component_id='my-input2', component_property='value'),
    ],
    prevent_initial_call=True,
)
def input_changed(input_value, input_value2):
    print('input updated')
    return f'Output: {input_value}, {input_value2}'


@dash.callback(
    [
        Output(component_id='my-output', component_property='children'),
        Output(component_id='my-output2', component_property='children'),
    ],
    Input(component_id='btn_test', component_property='n_clicks'),
    prevent_initial_call=True,
)
def btn_clicked(n_clicks):
    print('btn clicked')
    return [
        f'btn clicked {n_clicks} times',
        f'for output 2: btn clicked {n_clicks} times'
    ]


if __name__ == '__main__':
    app.run_server(debug=True, port=5662)
