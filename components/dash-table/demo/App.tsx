/* eslint no-magic-numbers: 0 */
import '@babel/polyfill/noConflict';
import React, {Component, ErrorInfo} from 'react';
import {DataTable} from 'dash-table/index';

import './style.less';

const table_data = [
    {
        name: 'bob',
        age: 32
    },
    {
        name: 'bob2',
        age: 34
    },
    {
        name: 'alan',
        age: 24
    },
    {
        name: null,
        age: 35
    },
    {
        name: 'alice',
        age: 24
    },
    {
        name: 'ed',
        age: null
    },
    {
        name: 'tom',
        age: 13
    },
    {
        name: 'peter',
        age: 33
    },
    {
        name: 'Lin',
        age: 23
    },
    {
        name: 'ethen',
        age: 43
    },
];

const table_cols = [
    {
        id: 'name',
        name: 'name'
    },
    {
        id: 'age',
        name: 'age'
    }
];

class ErrorBoundary extends React.Component {
    state = {
        hasError: false,
        error: '',
        info: ''
    };

    constructor(props: any) {
        super(props);
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        this.setState({
            error: error,
            info: info
        });
    }

    render() {
        return (
            <div>
                {this.props.children}
                <h5>Error msg</h5>
                <pre style={{color: 'red'}}>{this.state.error.toString()}</pre>
            </div>
        );
    }
}

class App extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            tableProps: {
                columns: table_cols,
                data: table_data,
                filter_action: 'native',
                sort_action: 'native',
                page_size:3,
                // virtualization: true,
                tooltip_conditional:[
                    {
                        'if': {
                            'filter_query': '{name} = "alice"',
                        },
                        'value': 'it is alice'
                    },
                    {
                        'if': {
                            'filter_query': '{name} = "Lin"',
                        },
                        'value': 'it is Lin'
                    }
                ]
            }
        };
    }

    render() {
        return (
            <div>
                <ErrorBoundary>
                    <DataTable
                        {...this.state.tableProps}
                        setProps={this.setProps}
                    />
                </ErrorBoundary>
                <h5>Table props:</h5>
                <pre>{JSON.stringify(this.state.tableProps, null, 2)}</pre>
            </div>
        );
    }

    private setProps = (newProps: any) => {
        console.log(newProps);
        this.setState((prevState: any) => ({
            tableProps: Object.assign({}, prevState.tableProps, newProps)
        }));
    };
}

export default App;
