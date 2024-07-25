import React, { useEffect, useState } from 'react';
import { FcPodiumWithSpeaker, FcPrivacy, FcAnswers } from "react-icons/fc";
import axios from 'axios';
import './ListaUsuarios.css';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const ListaUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const recebeUsuarios = async () => {
            try {
                const response = await axios.get(`${NODE_URL}/api/usuarios`); // Corrigido para corresponder à rota
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
                                <span><b>Usuario: </b> {usuario.full_name}</span>
                                <span><b>Login: </b> {usuario.username}</span>
                            </div>

                        </li>
                    ))}
                </div>
            </ul>
        </div>
    );
};

export default ListaUsuarios;
