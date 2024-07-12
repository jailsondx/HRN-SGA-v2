import React, { useState } from 'react';
import TelaLogin from '../../components/TelaLogin/TelaLogin';

function Login() {
    sessionStorage.setItem('username', '');
    return (
        <div>
            <TelaLogin />
        </div>
    );
}

export default Login;