import { chromium } from "playwright";
import { KvsClient } from "./kvs";

// 前回実行時からの経過時間を取得
const client = new KvsClient(Bun.env["KVS_ENDPOINT"] || "http://localhost:8000", "pokemon-sleep-friends.timestamp");
const lastExecutedAt = await client.get();
const now = new Date().getTime() / 1000;
const elapsed = now - lastExecutedAt;

// 28.5時間以内に実行されていたら終了
if (!isNaN(elapsed) && elapsed < 60 * 60 * 28.5) {
  console.log("28.5時間以内に実行されていたので終了します");
  process.exit(0);
}

// メッセージを生成
const message = (() => {
  let message = ""
  if (Math.random() > 0.5) {
    message += "ランク60です\n"
  }
  message += "イベント時以外は"
  if (Math.random() > 0.5) {
    message += "ゴル旧にいます\n"
  } else {
    message += "発電所にいます\n"
  }
  if (Math.random() > 0.5) {
    message += "コーヒー勢の飴を送り合える方よろしくお願いします"
  } else {
    message += "よろしくお願いします"
  }
  return message
})()

// メッセージを投稿してタイムスタンプを更新
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto("https://game8.jp/pokemonsleep/541511");
  await page.click("#js-commentFormDumy");
  await page.fill("#js-comment-form-code", "8125-5826-2452");
  await page.fill("#js-comment-form-textarea", message);
  await page.click("#js-comment-post");
  await client.set(new Date().getTime() / 1000);
  await page.waitForTimeout(3000);
} catch (e) {
  console.error(e);
} finally {
  await browser.close();
}

// 非同期ランタイムが終了しないことがあるので明示的に終了
process.exit(0);
