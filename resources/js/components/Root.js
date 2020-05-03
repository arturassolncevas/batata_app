import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import Index from './Index'
import { DatePicker } from 'antd';
import Locale from './locales/Locale'


//styles

function Root() {
    return (
        <BrowserRouter>
            <Index />
        </BrowserRouter>
    );
}

if (document.getElementById('example')) {
    ReactDOM.render(<Root />, document.getElementById('example'));
}
