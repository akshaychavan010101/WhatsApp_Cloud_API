const express = require('express');
const cors = require('cors');
const WhatsAppFeatures = require('./main/whatsAppFeatures');
const fileUpload = require('express-fileupload');
const handelReqValidation = require('./common/validators');
const schemas = require('./common/schemas');
const serverless = require('serverless-http')

const app = express();
app.use(cors());
app.use(express.json());


const getConfigfromHeaders = (header) => {
    if (!header) {
        throw new Error('Headers missing in request')
    }
    const {
        phone_number_id, whatsapp_business_id, access_token, graph_url, graph_version, timeout
    } = header;
    if (!phone_number_id) {
        throw new Error('missing header: phone_number_id')
    }
    if (!whatsapp_business_id) {
        throw new Error('missing header: whatsapp_business_id')
    }
    if (!access_token) {
        throw new Error('missing header: access_token')
    }
    handelReqValidation({
        phone_number_id, whatsapp_business_id, access_token, graph_url, graph_version, timeout
    }, schemas.ConfigSchema);
    return {
        phoneNumberId: phone_number_id,
        whatsappBusinessId: whatsapp_business_id,
        accessToken: access_token,
        graphUrl: graph_url || 'https://graph.facebook.com',
        graphVersion: graph_version || 'v19.0',
        timeout: timeout || 10000
    }
}

app.get('/', (req, res) => {
    res.send('whatsapp Cloud Api');
})

app.post('/send_text/:to', async (req, res) => {
    try {
        const config = getConfigfromHeaders(req.headers);
        handelReqValidation(req.body, schemas.TextSchema);
        const { body, options } = req.body
        const { to } = req.params
        if (!to) {
            throw new Error('Reciever is required');
        }
        const whatsappFeature = new WhatsAppFeatures(config)
        const response = await whatsappFeature.sendText(to, body, options);
        res.json(response);
    } catch (error) {
        res.json({ error: error.message });
    }
})

app.post('/send_document/:to', async (req, res) => {
    try {
        const config = getConfigfromHeaders(req.headers);
        handelReqValidation(req.body, schemas.DocumentSchema);
        const { link, id, options } = req.body
        const { to } = req.params
        if (!to) {
            throw new Error('Reciever is required');
        }
        const whatsappFeature = new WhatsAppFeatures(config)
        const response = await whatsappFeature.sendDocument(to, link || id, options);
        res.json(response);
    } catch (error) {
        res.json({ error: error.message });
    }
})

app.post('/send_audio/:to', async (req, res) => {
    try {
        const config = getConfigfromHeaders(req.headers);
        handelReqValidation(req.body, schemas.AudioSchema);
        const { link, id } = req.body
        const { to } = req.params
        if (!to) {
            throw new Error('Reciever is required');
        }
        const whatsappFeature = new WhatsAppFeatures(config)
        const response = await whatsappFeature.sendAudio(to, link || id);
        res.json(response);
    } catch (error) {
        res.json({ error: error.message });
    }
})

app.post('/send_video/:to', async (req, res) => {
    try {
        const config = getConfigfromHeaders(req.headers);
        handelReqValidation(req.body, schemas.VideoSchema);
        const { link, id, options } = req.body
        const { to } = req.params
        if (!to) {
            throw new Error('Reciever is required');
        }
        const whatsappFeature = new WhatsAppFeatures(config)
        const response = await whatsappFeature.sendVideo(to, link || id, options);
        res.json(response);
    } catch (error) {
        res.json({ error: error.message });
    }
})

app.post('/create_template', async (req, res) => {
    try {
        const config = getConfigfromHeaders(req.headers);
        handelReqValidation(req.body, schemas.CreateTemplateSchema);
        const { category, name, language, components } = req.body
        const whatsappFeature = new WhatsAppFeatures(config)
        const response = await whatsappFeature.createTemplate(category, name, language, components);
        res.json(response);
    } catch (error) {
        res.json({ error: error.message });
    }
})

app.post('/send_template/:to', async (req, res) => {
    try {
        const config = getConfigfromHeaders(req.headers);
        handelReqValidation(req.body, schemas.SendTemplateSchema);
        const { name, language, components } = req.body
        const { to } = req.params
        if (!to) {
            throw new Error('Reciever is required');
        }
        const whatsappFeature = new WhatsAppFeatures(config)
        const response = await whatsappFeature.sendTemplate(to, name, language, components);
        // const response = await whatsappFeature.sendTemplate(919373849068, "test_template", "en_US", [
        //     {
        //         type: 'body',
        //         parameters: [
        //             {
        //                 type: 'text',
        //                 text: 'akshay',
        //             },
        //             {
        //                 type: 'text',
        //                 text: 'chavan',
        //             }
        //         ]
        //     }
        // ])
        res.json(response);
    } catch (error) {
        res.json({ error: error.message });
    }
})

app.post('/send_image/:to', async (req, res) => {
    try {
        const config = getConfigfromHeaders(req.headers);
        handelReqValidation(req.body, schemas.ImageSchema);
        const { link, id, options } = req.body
        const { to } = req.params
        if (!to) {
            throw new Error('Reciever is required');
        }
        const whatsappFeature = new WhatsAppFeatures(config)
        const response = await whatsappFeature.sendImage(to, link || id, options);
        res.json(response);
    } catch (error) {
        res.json({ error: error.message });
    }
})

app.get('/get_templates', async (req, res) => {
    try {
        const config = getConfigfromHeaders(req.headers);
        handelReqValidation(req.query, schemas.QuerySchema);
        const whatsappFeature = new WhatsAppFeatures(config)
        const response = await whatsappFeature.getTemplates(req.query);
        res.json(response);
    } catch (error) {
        res.json({ error: error.message });
    }
})

app.get('/show_template/:id', async (req, res) => {
    try {
        const config = getConfigfromHeaders(req.headers);
        const { id } = req.params
        if (!id) {
            throw new Error('Template id is required');
        }
        const whatsappFeature = new WhatsAppFeatures(config)
        const response = await whatsappFeature.showTemplate(id);
        res.json(response);
    } catch (error) {
        res.json({ error: error.message });
    }
})

app.delete('/delete_template', async (req, res) => {
    try {
        const config = getConfigfromHeaders(req.headers);
        const { name } = req.query
        if (!name) {
            throw new Error('Template name is required');
        }
        const whatsappFeature = new WhatsAppFeatures(config)
        const response = await whatsappFeature.deleteTemplate(name);
        res.json(response);
    } catch (error) {
        res.json({ error: error.message });
    }
})

app.post('/upload_media', fileUpload(), async (req, res) => {
    try {
        const config = getConfigfromHeaders(req.headers);
        const file = req.files?.file;
        if (!file) {
            throw new Error('File is required');
        }
        const whatsappFeature = new WhatsAppFeatures(config)
        const response = await whatsappFeature.uploadMedia({ file, formHeaders: req.headers });
        res.json(response);
    } catch (error) {
        res.json({ error: error.message });
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})

//lambda handling
const handler = serverless(app)

exports.handler = async (event, context, callback) => {
    const response = handler(event, context, callback)
    return response
}