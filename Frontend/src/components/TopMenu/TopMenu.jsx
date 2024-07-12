import React, { useState, useEffect } from "react";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import './TopMenu.css';

function TopMenu() {
  const [showModal, setShowModal] = useState(false);
  const [recepcao, setRecepcao] = useState(localStorage.getItem('recepcaoLocation') || '');
  const [guiche, setGuiche] = useState(localStorage.getItem('guicheLocation') || '');

  const handleSave = () => {
    localStorage.setItem('recepcaoLocation', recepcao);
    localStorage.setItem('guicheLocation', guiche);
    setShowModal(false);
    window.location.reload();
  };

  return (
    <div className='Menu'>
      <nav className='Menu-Navbar'>
        <div className='Menu-Title'>
        <span className="span-Title-TopMenu">Atendimento</span>
        </div>
        <div className='Menu-Configs'>
          <span><b>Recepção: </b>{recepcao}</span>
          <span><b>Guiche: </b> {guiche}</span>
        </div>
        <div className="Menu-Icon">
          <TbAdjustmentsHorizontal className="Icon" onClick={() => setShowModal(true)} />
        </div>
      </nav>
      {showModal && (
        <div className='Modal'>
          <div className='Modal-Content'>
            <h2>Configurar Atendimento</h2>
            <label>
              Recepção:
              <select value={recepcao} onChange={(e) => setRecepcao(e.target.value)}>
                <option value="">Selecione</option>
                <option value="Recepcao Principal">Recepção Principal</option>
                <option value="Recepcao Emergencia">Recepção Emergencia</option>
                <option value="Recepcao Ambulatorio">Recepção Ambulatório</option>
              </select>
            </label>
            <label>
              Guiche:
              <select value={guiche} onChange={(e) => setGuiche(e.target.value)}>
                <option value="">Selecione</option>
                <option value="Guiche 01">Guiche 1</option>
                <option value="Guiche 02">Guiche 2</option>
                <option value="Guiche 03">Guiche 3</option>
              </select>
            </label>
            <button onClick={handleSave}>Salvar</button>
            <button onClick={() => setShowModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopMenu;
