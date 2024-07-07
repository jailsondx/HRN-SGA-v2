export function VerificaLocalStorage(){

    const recepcao = localStorage.getItem('recepcaoLocation');
    const guiche = localStorage.getItem('guicheLocation');

    if(!recepcao || !guiche){
        return null;
    } else {
        return 'LocalStorage Checked'
    }
}

export function VerificaLocalStorageGuiche(){

    const guicheLocation = localStorage.getItem('guicheLocation');

    if(!guicheLocation){
        return null;
    } else {
        return guicheLocation;
    }
}

export function VerificaLocalStorageRecepcao(){

    const recepcaoLocation = localStorage.getItem('recepcaoLocation');

    if(!recepcaoLocation){
        return null;
    } else {
        return recepcaoLocation;
    }
}

export function VerificaLocalStorageTV(){

    const tvLocation = localStorage.getItem('tvLocation');

    if(!tvLocation){
        return null;
    } else {
        return tvLocation;
    }
}

export function VerificaLocalStorageTotem(){

    const totemLocation = localStorage.getItem('totemLocation');

    if(!totemLocation ){
        return null;
    } else {
        return totemLocation;
    }
}
