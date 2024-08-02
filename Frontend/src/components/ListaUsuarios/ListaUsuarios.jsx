import React, { useEffect, useState } from 'react';
import { FcPodiumWithSpeaker, FcKey, FcDeleteDatabase } from "react-icons/fc";
import axios from 'axios';
import './ListaUsuarios.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const ListaUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');
    const [snackbar, setOpenSnackbar] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const username = sessionStorage.getItem('username');

    useEffect(() => {
        const recebeUsuarios = async () => {
            try {
                const response = await axios.get(`${NODE_URL}/api/usuarios`);
                setUsuarios(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
                setError('Erro ao buscar usuários');
                setUsuarios([]); // Limpa os usuários em caso de erro
            }
        };

        recebeUsuarios();
    }, []); // Array de dependências vazio para executar apenas na montagem do componente

    if (error) {
        return <div>{error}</div>;
    }

    const resetPassword = async (username) => {
        const newPassword = '@isgh2024'; // Define a senha padrão

        try {
            const response = await axios.post(`${NODE_URL}/api/cadastro-update-password`, {
                username,            // O usuário que está solicitando a mudança
                targetUsername: username,  // O usuário que terá a senha atualizada
                newPassword
            });

            const { message, error } = response.data;

            if (message) {
                setFeedbackMessage(message);
                setAlertSeverity('success');
            } else if (error) {
                setFeedbackMessage(error);
                setAlertSeverity('error');
            }
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            setFeedbackMessage('Erro ao atualizar senha. Por favor, tente novamente mais tarde.');
            setAlertSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className='div-Pai-Lista-Usuarios'>
            <div className='container-Title-Module-g'>
                <span className='span-Title-g'>Lista de Usuários</span>
            </div>

            <ul>
                <div className='div-ListaUsers'>
                    {usuarios.map((usuario) => (
                        <li className='li-container-ListaUsuarios' key={usuario.id}>
                            <div className='container-Icon-Usuarios'>
                                <FcPodiumWithSpeaker className="Icon-Cadastro" />
                            </div>
                            <div className='div-li-InforUsuarios'>
                                <span><b>Usuário: </b> {usuario.full_name}</span>
                                <span><b>Login: </b> {usuario.username}</span>
                            </div>

                            <div className='div-Icon-UsersOptions'>
                                {usuario.username !== username && (
                                    <>
                                        <FcKey className='Icon-Users-Options' onClick={() => resetPassword(usuario.username)} title='Resetar Senha' />
                                        <FcDeleteDatabase className='Icon-Users-Options' title='Apagar Usuário' />
                                    </>
                                )}
                            </div>

                        </li>
                    ))}
                </div>
            </ul>

            <Snackbar open={snackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={alertSeverity}
                    variant="filled"
                    sx={{ width: '100%' }}>
                    {feedbackMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ListaUsuarios;
