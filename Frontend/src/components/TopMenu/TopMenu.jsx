import React, { useState, useEffect } from "react";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import SelectModal from '../Modal/SelectModal'
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
          <span><b>Guichê: </b> {guiche}</span>
        </div>
        <div className="Menu-Icon">
          <TbAdjustmentsHorizontal className="Icon" onClick={() => setShowModal(true)} />
        </div>
      </nav>
      <SelectModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        onSave={handleSave}
        recepcao={recepcao}
        setRecepcao={setRecepcao}
        guiche={guiche}
        setGuiche={setGuiche}
        message="Configure a Recepcao"
      />
    </div>
  );
}

export default TopMenu;
