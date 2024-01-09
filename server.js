import { handler } from './build/handler.js';
import express from 'express';

const app = express();

// 例えば今回作ったSvelteKitアプリと関係ない、aws用のヘルスチェックパスを作る
app.get('/health', (_, res) => {
	var param = { value: 'success' };
	res.header('Content-Type', 'application/json; charset=utf-8');
	res.send(param);
});

// ビルドで作ったSvelteはこちらでハンドリングされます
app.use(handler);

app.listen(3000, () => {
	console.log('listening on port 3000');
});
