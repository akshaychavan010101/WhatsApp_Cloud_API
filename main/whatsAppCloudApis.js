const axios = require("axios");

class WhatsAppCloudApis {
  constructor(config) {
    this.config = config;

    this.headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.config?.accessToken,
    };

    this.mandatory = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
    }
  }
  async send(data, parse = true) {
    let { timeout, phoneNumberId, graphUrl, graphVersion } = this.config;

    const response = await axios({
      validateStatus: (status) => status <= 999,
      method: "POST",
      url: `${graphUrl}/${graphVersion}/${phoneNumberId}/messages`,
      timeout,
      headers: this.headers,
      data: { ...this.mandatory, ...data },
      responseType: "json",
    });

    if ("error" in response.data) {
      throw new Error(response.data.error?.error_user_msg ||
        response.data.error?.error_data?.details || response.data.error?.message
      );
    }

    return parse ? WhatsAppCloudApis.parse(response.data) : response.data;
  }

  async upload({ file, formHeaders }) {
    let { timeout, phoneNumberId, graphUrl, graphVersion } = this.config;
    const response = await axios({
      validateStatus: (status) => status <= 999,
      method: 'POST',
      url: `${graphUrl}/${graphVersion}/${phoneNumberId}/media`,
      timeout,
      headers: { ...formHeaders, ...this.headers },
      data: { ...file, ...this.mandatory },
      responseType: 'json',
    });
    if ('error' in response.data) {
      throw new Error(response.data.error?.error_user_msg || response.data.error?.error_data?.details || response.data.error?.message);
    }
    return response.data;
  }

  async createTemplate(data) {
    let { timeout, whatsappBusinessId, graphUrl, graphVersion } = this.config
    const response = await axios({
      validateStatus: (status) => status <= 999,
      method: 'POST',
      url: `${graphUrl}/${graphVersion}/${whatsappBusinessId}/message_templates`,
      timeout,
      headers: this.headers,
      data: data,
      responseType: 'json',
    })

    if ('error' in response.data) {
      throw new Error(response.data.error?.error_user_msg || response.data.error?.error_data?.details || response.data.error?.message)
    }

    return response.data
  }

  async getTemplates(options = {}) {
    let { timeout, whatsappBusinessId, graphUrl, graphVersion } = this.config
    let qs = ''

    if (options) {
      if (options.fields && options.fields.length > 0) {
        qs += qs.length > 0 ? '&' : '?'
        qs += `fields=${options.fields.join(',')}`
      }

      if (options.limit) {
        qs += qs.length > 0 ? '&' : '?'
        qs += `limit=${options.limit}`
      }

      if (options.after) {
        qs += qs.length > 0 ? '&' : '?'
        qs += `after=${options.after}`
      }
      if (options.before) {
        qs += qs.length > 0 ? '&' : '?'
        qs += `before=${options.before}`
      }
    }

    const response = await axios({
      validateStatus: (status) => status <= 999,
      method: 'GET',
      url: `${graphUrl}/${graphVersion}/${whatsappBusinessId}/message_templates${qs}`,
      timeout,
      headers: this.headers,
      responseType: 'json',
    })

    if ('error' in response.data) {
      throw new Error(response.data.error?.error_user_msg || response.data.error?.error_data?.details || response.data.error?.message)
    }

    return response.data
  }

  async showTemplate(id) {
    let { timeout, graphUrl, graphVersion } = this.config

    const response = await axios({
      validateStatus: (status) => status <= 999,
      method: 'GET',
      url: `${graphUrl}/${graphVersion}/${id}`,
      timeout,
      headers: this.headers,
      responseType: 'json',
    })

    if ('error' in response.data) {
      throw new Error(response.data.error?.error_user_msg || response.data.error?.error_data?.details || response.data.error?.message)
    }

    return response.data
  }

  async deleteTemplate(name) {
    let { timeout, graphUrl, graphVersion, whatsappBusinessId } = this.config;
    const response = await axios({
      validateStatus: (status) => status <= 999,
      method: 'DELETE',
      url: `${graphUrl}/${graphVersion}/${whatsappBusinessId}/message_templates?name=${name}`,
      timeout,
      headers: this.headers,
      responseType: 'json',
    });
    if ('error' in response.data) {
      throw new Error(response.data.error?.error_user_msg || response.data.error?.error_data?.details || response.data.error?.message);
    }
    return response.data;
  }

  static parse(data) {
    return {
      input: Number(data.contacts[0].input),
      phone: data.contacts[0].wa_id,
      wamid: data.messages[0].id,
    }
  }
}

module.exports = WhatsAppCloudApis;
