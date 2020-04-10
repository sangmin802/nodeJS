const express = require('express');
const router = express.Router();
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
const template = require('../lib/template.js');

router.get('/create', (req, res) => {
    const title = 'Create';
    const list  = template.list(req.list);
    const html = template.HTML(title, list, `
    <h2>${title}</h2>
    <form action="/topic/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit" value="create">
      </p>
    </form>
    `, ``);
    res.send(html);
});

router.post('/create_process', (req, res) => {
    const post = req.body;
    fs.writeFile(`./data/${post.title}`, post.description, 'utf8', (err) => {
        if(!err){
        res.redirect(`/topic/${post.title}`);
        };
    });
});

router.get('/update/:pageId', (req, res) => {
    const filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`./data/${filteredId}`, 'utf8', (err2, description) => {
        if(!err2){
        const title = 'Update';
        const list = template.list(req.list);
        const html = template.HTML(title, list, `
        <h2>${title}</h2>
        <form action="/topic/update_process" method="post">
            <input type="hidden" name="id" value="${sanitizeHtml(filteredId)}">
            <p>
            <input type="text" name="title" value="${sanitizeHtml(filteredId)}">
            </p>
            <p>
            <textarea name="description">${sanitizeHtml(description)}</textarea>
            </p>
            <input type="submit" value="update">
        </form>
        `, ``);
        res.send(html);
        };
    });
});

router.post('/update_process', (req, res) => {
    const post = req.body;
    fs.rename(`./data/${post.id}`, `./data/${post.title}`, (err) => {
        fs.writeFile(`./data/${post.title}`, post.description, 'utf8', (err2) => {
            if(!err && !err2){
                res.redirect(`/topic/${post.title}`);
            };
        });
    })
});

router.get('/:pageId', (req, res, next) => {
    const filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`./data/${filteredId}`, 'utf8', (err2, description) => {
        if(!err2){
            const sanitizedTitle = sanitizeHtml(filteredId);
            const sanitizedDescription = sanitizeHtml(description);
            const list = template.list(req.list);
            const html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                `
                <a href="/topic/create">create</a>
                <a href="/topic/update/${sanitizedTitle}">update</a>
                <form action="/topic/delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
                </form>
            `
        );
            res.send(html);
        }else{
            next(err2);
        };
    });
});

router.post('/delete_process', (req, res) => {
    const post = req.body;
    fs.unlink(`./data/${post.id}`, (err) => {
        if(!err){
        res.redirect('/');
        }
    })
});

module.exports = router;