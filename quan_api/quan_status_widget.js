// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: grin-beam;
// 
// Status widget for Quantumult X
// 

const apiTimeout = 1;
const widgetBgr = '#ba2d65'

const quanAPI = {
  address: 'http://quan.api/v1'
};

async function getStatus() {
  const url = `${quanAPI.address}/status`;
  const req = new Request(url)
  req.timeoutInterval = apiTimeout;

  const apiResult = await req.loadJSON() 
  return apiResult;
}

async function buildWidget(){
  var objectState = await getStatus();

  await layoutWidget(objectState)
}

async function layoutWidget(objectState) {
  
  // Title
  {
    const header = widget.addStack()

    const headerSymbol = SFSymbol.named("paperplane.fill")
    const headerImage = header.addImage(headerSymbol.image)
    headerImage.tintColor = Color.white()
    headerImage.imageSize = new Size(13, 13)
    headerImage.rightAlignImage()

    const titleLabel = header.addText(' Quantumult X')
    titleLabel.font = Font.semiboldSystemFont(12)
  }

  // Proxy chain
  {
    var proxyChain = 'PROXY: '

    exitProxy = objectState['policy']['proxy']
    for(var i=1; i< exitProxy.length; i++){
      proxyChain += (i===1?'':'->') + exitProxy[i]
    }

    const proxyLabel = widget.addText(proxyChain)
    proxyLabel.font = Font.semiboldSystemFont(8)
  }

  // Top 4 proxies by RX
  const KB = 1024
  const MB = 1024*1024
  const GB = 1024*1024*1024

  objectState['traffic'].sort((a,b) => a.rx_transfer < b.rx_transfer)

  for(var i=0; i<objectState['traffic'].length && i<4; i++){
  
    widget.addSpacer()
    {
      const nameStack = widget.addStack();
    
      const srvLabel = nameStack.addText(objectState['traffic'][i].name.toUpperCase())
      srvLabel.font = Font.semiboldSystemFont(10)
    
      nameStack.addSpacer()
    
      const typeLabel = nameStack.addText(objectState['traffic'][i].type.toUpperCase())
      typeLabel.font = Font.semiboldSystemFont(10)   
    }

    var tx = objectState['traffic'][i].tx_transfer
    var txUnit = "B"
    if(tx < KB) {
      //...
    }
    else if(tx >= KB && tx < MB) {
      tx = tx / KB
      txUnit = 'KB'
    }
    else if (tx >= MB && tx < GB) {
      tx = tx / MB
      txUnit = 'MB'
    }
    else {
      tx = tx / GB
      txUnit = 'GB'
    }

    var rx = objectState['traffic'][i].rx_transfer
    var rxUnit = "B"
    if(rx < KB) {
      //...
    }
    else if(rx >= KB && rx < MB) {
      rx = rx / KB
      rxUnit = 'KB'
    }
    else if (rx >= MB && rx < GB) {
      rx = rx / MB
      rxUnit = 'MB'
    }
    else {
      rx = rx / GB
      rxUnit = 'GB'
    }

    {
      const netStack = widget.addStack();
      
      const rxSymbol = SFSymbol.named("arrow.down")
      const rxImage = netStack.addImage(rxSymbol.image)
      rxImage.tintColor = Color.white()
      rxImage.imageSize = new Size(10, 10)
  
      const rxLabel = netStack.addText(Number(rx).toFixed(1) + ' ' + rxUnit)
      rxLabel.font = Font.semiboldSystemFont(10)
  
      netStack.addSpacer();
  
      const txSymbol = SFSymbol.named("arrow.up")
      const txImage = netStack.addImage(txSymbol.image)
      txImage.tintColor = Color.white()
      txImage.imageSize = new Size(10, 10)
  
      const txLabel = netStack.addText(Number(tx).toFixed(1) + ' ' + txUnit)
      txLabel.font = Font.semiboldSystemFont(10)
    } 
  }
  
}

const widget = new ListWidget();
widget.backgroundColor = new Color(widgetBgr);
widget.setPadding(10, 10, 10, 10);

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
