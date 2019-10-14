function doc (event) {
  //document.getElementById('hameed').style.display = 'none'
  document.getElementById('doc-nav').classList.remove('normal')
  if (event.target.id === 'oc') {
    document.getElementById('oc').classList.add('selected')
    document.getElementById('content').classList.remove('selected')
    document.getElementById('design').classList.remove('selected')
    document.getElementById('oc-doc').style.display = 'block'
    document.getElementById('content-doc').style.display = 'none'
    document.getElementById('design-doc').style.display = 'none'
  }
  if (event.target.id === 'content') {
    document.getElementById('oc').classList.remove('selected')
    document.getElementById('content').classList.add('selected')
    document.getElementById('design').classList.remove('selected')
    document.getElementById('content-doc').style.display = 'block'
    document.getElementById('oc-doc').style.display = 'none'
    document.getElementById('design-doc').style.display = 'none'
  }
  if (event.target.id === 'design') {
    document.getElementById('oc').classList.remove('selected')
    document.getElementById('content').classList.remove('selected')
    document.getElementById('design').classList.add('selected')
    document.getElementById('design-doc').style.display = 'block'
    document.getElementById('oc-doc').style.display = 'none'
    document.getElementById('content-doc').style.display = 'none'
  }
}
