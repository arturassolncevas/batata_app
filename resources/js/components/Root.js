import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import Index from './Index'
import { DatePicker } from 'antd';
import Locale from './locales/Locale'
import RequestInterceptor from './services/RequestInterceptor'


//styles

function Root() {
    return (
        <RequestInterceptor>
            <BrowserRouter>
                <Index />
            </BrowserRouter>
        </RequestInterceptor>
    );
}

if (document.getElementById('example')) {
    ReactDOM.render(<Root />, document.getElementById('example'));
}
