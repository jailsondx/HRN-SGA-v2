const path = require('path');
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const getCurrentDateTime = require('./Datas')

async function imprimirTexto(texto) {
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: 'tcp://10.2.4.51',
    options: {
      timeout: 5000
    },
    width: 48,
    characterSet: 'PC860_PORTUGUESE',
    removeSpecialCharacters: false,
    lineCharacter: '_',
  });

  const imagePath = path.resolve(__dirname, '../public/printer-logoHRN.png');

  try {
    const isConnected = await printer.isPrinterConnected();
    if (isConnected) {
      printer.alignCenter();
      printer.setTypeFontB();

      await printer.printImage(imagePath);

      printer.newLine();
      printer.newLine();

      printer.setTextSize(1, 1);
      printer.bold(true);
      printer.println(texto);

      printer.newLine();

      printer.setTextNormal();
      printer.setTextSize(7, 7);
      printer.bold(false);
  
      printer.println(getCurrentDateTime());
      printer.drawLine();  

      printer.println('Hospital mantido com recurso publicos');
      printer.println('sem lins lucrativos');

      printer.bold(false);
      printer.cut();
      await printer.execute();
      //console.log('Texto impresso com sucesso!');
    } else {
      console.error('Erro: Impressora não conectada.');
    }
  } catch (error) {
    console.error('Erro ao imprimir:', error);
  }
}

module.exports = imprimirTexto;
