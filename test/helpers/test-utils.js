import { oyc } from "oyc";

export function makeResponse(content) {
  return new Response(typeof content === "string" ? content : JSON.stringify(content), { status: 200, statusText: 'OK', });
}

export function makeTestArea() {
  if (document.getElementById("test-area")) {
    clearTestArea();
    return;
  }

  const testArea = document.createElement("div");
  testArea.setAttribute("id", "test-area");
  document.body.appendChild(testArea);
}

export function clearTestArea() {
  const testArea = document.getElementById("test-area");
  if (testArea) {
    testArea.innerHTML = "";
  }
}

function getTestArea() {
  const testArea = document.getElementById("test-area");
  if (!testArea) {
    throw new Error("No test area found.");
  }
  return testArea;
}

export function addTestHTML(html) {
  const fragment = document.createRange().createContextualFragment(html);

  const testArea = getTestArea();
  if (!testArea) {
    // This is guaranteed by the code below where we queue up the function
    // to run when the document is ready.
    throw new Error("No test area found.");
  }

  let child = null;

  while (fragment.children.length > 0) {
    child = fragment.children[0];
    // Append child is a move operation
    testArea.appendChild(child);
    oyc.process(child);
  }

  //Return last processed child
  return child;
}
