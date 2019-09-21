/* eslint-disable no-console */
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import renderPage from './page/render';
import productApi from "./api";
import redFetch from "./fetch";

const app = express();
app.use(morgan('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/red/images', express.static('./images'));
app.use('/red', express.static('./build'));

app.get('/:sku?', (req, res) => {
    redFetch().then(variants => {
        const html = renderPage(variants, req.query.sku);
        res.render('layout', {
            html: html,
            sentry_dns: process.env.TEAM_RED_SENTRY_DNS
        });
    });
});

app.use('/red/api/products', productApi);

app.listen(3003);
console.log(`🔴  team red running. product page is available here:
>> http://127.0.0.1:3003/`);
