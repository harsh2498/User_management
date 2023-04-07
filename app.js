let mongoose = require('mongoose');
let express = require('express');
let ejs = require('ejs');
let app = express();
let path = require('path');
const fileUpload = require('express-fileupload');
let currentPath = path.join(__dirname, 'views');
let userSchema = require('./userSchema');
let blogSchema = require('./blogSchema');
app.set('view engine', 'ejs');
let user = mongoose.model('User', userSchema);
let blog = mongoose.model('Blog', blogSchema);
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);


let details = [];
const now = new Date();

const year = now.getFullYear();
const month = ("0" + (now.getMonth() + 1)).slice(-2);
const day = ("0" + now.getDate()).slice(-2);

// YYYY-MM-DD


app.get('/addBlog', (req, res) => {
    res.sendFile(`${currentPath}/blogForm.html`)
})
app.get('/blog', async (req, res) => {
    let datas = await blog.find();
    for(let i = 0;i<datas.length;i++){
        details.push({
            imagepath:datas[i].image,
            disc:datas[i].disc,
            date:datas[i].date,
            title:datas[i].title
        })
    }
    res.render('blog',{data:details});
    details = [];
})

app.post('/addBlog', async (req, res) => {
    details = [];
    const { image } = req.files;
    if (!image) return res.sendStatus(400);
    image.mv(__dirname + '/views/upload/' + image.name);
    let disc = req.body.disc;
    let title = req.body.title;
    let imagename = `../upload/${image.name}`
    let data = await blog({image: imagename,disc: disc,date:`${day}-${month}-${year}`,title:title});
    let result = await data.save()
    let datas = await blog.find();
    console.log( );
    for(let i = 0;i<datas.length;i++){
        details.push({
            imagepath:datas[i].image,
            disc:datas[i].disc,
            date:datas[i].date,
            title:datas[i].title
        })
    }
    res.render('blog',{data:details})
    details = [];
    
});

app.get('/', (req, res) => {
    res.sendFile(`${currentPath}/home.html`);
});

app.get('/signup', (req, res) => {
    res.sendFile(`${currentPath}/form.html`)
})
app.post('/signup', async (req, res) => {
    let data = await user(req.body);
    let result = await data.save()
    console.log(result);
    res.send("<h1>Registration Successfully </h1>")
})

app.get('/login', (req, res) => {
    res.sendFile(`${currentPath}/login.html`)
})

app.post('/login', async (req, res) => {
    try {
        const userdata = await user.findOne({
            $or:[{ email: req.body.username }, {phone: req.body.username}]
        });
        if (userdata) {
            const result = (req.body.password === userdata.password);
            if (result) {
                res.sendFile(`${currentPath}/secret.html`)
            } else {
                res.status(400).json({ error: "password doesn't match" });
            }
        } else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
})
let port = 3000;
app.listen(port, () => {
    console.log(`server is runnig at port ${port}`);
});