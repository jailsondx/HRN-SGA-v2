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

            <span className='span-Title-g'>Lista de Usuários</span>


            <div>
                <ul>
                    <div className='container-Icon-Cadastro'>
                        <FcAnswers className="Icon-Cadastro" />
                    </div>
                    {usuarios.map((usuario) => (
                        <li className='li-container-ListaUsuarios' key={usuario.id}>
                            <span>Usuario: {usuario.full_name}</span>
                            <span>Login: {usuario.username}</span>
                            <span>Categoria: {usuario.access_level}</span>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
};

export default ListaUsuarios;
