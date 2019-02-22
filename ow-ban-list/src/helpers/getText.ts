import fetch from 'node-fetch'


/**
 * @description Shortcut of `fetch(url).then(res => res.text())`.
 * @param url URL of the target web page.
 */
export async function getText(url: string) {
  return await (await fetch(url)).text()
}

export default getText