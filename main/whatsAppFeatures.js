const WhatsAppCloudApis = require("./whatsAppCloudApis");
const Helpers = require("../common/helpers");
const { default: axios } = require("axios");

class WhatsAppFeatures {
  constructor({
    phoneNumberId,
    whatsappBusinessId,
    accessToken,
    graphUrl = "https://graph.facebook.com",
    graphVersion = "v19.0",
    timeout = 10000,
  }) {
    this.client = new WhatsAppCloudApis({
      phoneNumberId,
      whatsappBusinessId,
      accessToken,
      graphUrl,
      graphVersion,
      timeout,
    });
  }

  async sendText(to, text, options = {}) {
    return await this.client.send({
      to,
      type: "text",
      text: {
        preview_url: options?.preview_url || false,
        body: text,
      },
    });
  }

  async sendImage(to, media, options = {}) {
    const image = Helpers.isUrl(media) ? { link: media } : { id: media };
    return await this.client.send({
      to,
      type: "image",
      image: {
        ...image,
        ...options,
      },
    });
  }

  async sendDocument(to, media, options = {}) {
    const document = Helpers.isUrl(media) ? { link: media } : { id: media };
    return await this.client.send({
      to,
      type: "document",
      document: {
        ...document,
        ...options,
      },
    });
  }
  async sendAudio(to, media) {
    const audio = Helpers.isUrl(media) ? { link: media } : { id: media };
    return await this.client.send({
      to,
      type: "audio",
      audio
    });
  }
  async sendVideo(to, media, options = {}) {
    const video = Helpers.isUrl(media) ? { link: media } : { id: media };
    return await this.client.send({
      to,
      type: "video",
      video: {
        ...video,
        ...options,
      },
    });
  }

  async sendSticker(to, media) {
    const sticker = Helpers.isUrl(media) ? { link: media } : { id: media };
    return await this.client.send({
      to,
      type: "sticker",
      sticker,
    });
  }

  async sendLocation(to, coordinate, options = {}) {
    return await this.client.send({
      to,
      type: "location",
      location: {
        coordinate,
        ...options,
      },
    });
  }

  async sendTemplate(to, template, language, components = []) {
    return await this.client.send({
      to,
      type: "template",
      template: {
        name: template,
        language: {
          code: language,
        },
        components,
      },
    });
  }

  async createTemplate(category, name, language, components = []) {
    return await this.client.createTemplate({
      category,
      name,
      language,
      components,
    });
  }

  async getTemplates(options = {}) {
    return await this.client.getTemplates(options);
  }

  async showTemplate(id) {
    return await this.client.showTemplate(id);
  }

  async deleteTemplate(name) {
    return await this.client.deleteTemplate(name);
  }

  async uploadMedia(form) {
    return await this.client.upload(form);
  }
}

module.exports = WhatsAppFeatures;
