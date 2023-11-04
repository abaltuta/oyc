import sinon from 'sinon';

export function makeServer(){
  const server = sinon.fakeServer.create();
  server.fakeHTTPMethods = true;
  server.getHTTPMethod = function(xhr) {
      return getHTTPMethod(xhr);
  }
  return server;
}

export function clearTestArea() {
  const testArea = document.getElementById('test-area');
  if (testArea) {
    testArea.innerHTML = '';
  }
}

export function addTestHTML(html) {
  const testArea = document.getElementById('test-area');
  if (testArea) {
    testArea.innerHTML += html;
  }
}