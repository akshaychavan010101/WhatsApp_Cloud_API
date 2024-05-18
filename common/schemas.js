const Joi = require('joi');

const ConfigSchema = Joi.object({
    phone_number_id: Joi.string().required(),
    whatsapp_business_id: Joi.string().required(),
    access_token: Joi.string().required(),
    graph_url: Joi.string().optional(),
    graph_version: Joi.string().optional(),
    timeout: Joi.number().optional()
})

const TextOptions = Joi.object({
    preview_url: Joi.string().uri().optional()
})

const QuerySchema = Joi.object({
    fields: Joi.array().items(Joi.string().valid('id', 'category', 'components', 'language', 'message_send_ttl_seconds', 'name', 'previous_category', 'quality_score', 'rejected_reason', 'status').required()),
    limit: Joi.number().optional(),
    after: Joi.string().optional(),
    before: Joi.string().optional()
})

const TemplateCategory = Joi.string().valid('AUTHENTICATION', 'MARKETING', 'UTILITY').required();
const CurrencyObject = Joi.object({
    fallback_value: Joi.string().required(),
    code: Joi.string().required(),
    amount_1000: Joi.number().required()
})
const DateTimeObject = Joi.object({
    fallback_value: Joi.string().required()
})

const MediaObject = Joi.object({
    id: Joi.string().optional(),
    link: Joi.string().optional(),
    caption: Joi.string().optional(),
    filename: Joi.string().optional(),
    provider: Joi.string().optional()
})

const ParameterObject = Joi.object({
    type: Joi.string().valid('currency', 'date_time', 'document', 'image', 'text', 'video', 'payload').required(),
    payload: Joi.string().optional(),
    text: Joi.string().optional(),
    currency: CurrencyObject.optional(),
    date_time: DateTimeObject.optional(),
    image: MediaObject.optional(),
    document: MediaObject.optional(),
    video: MediaObject.optional()
})

const ComponentOptions = Joi.object({
    type: Joi.string().valid('header', 'body', 'footer', 'button').required(),
    sub_type: Joi.string().valid('quick_reply', 'url').optional(),
    index: Joi.string().optional(),
    parameters: Joi.array().items(ParameterObject).required()
})

const ComponentType = Joi.string().valid('BODY', 'HEADER', 'FOOTER', 'BUTTONS', 'URL').required();

const ComponentButtonType = Joi.string().valid('PHONE_NUMBER', 'URL', 'QUICK_REPLY').required();

const ComponentFormat = Joi.string().valid('TEXT', 'IMAGE', 'DOCUMENT', 'VIDEO', 'AUDIO', 'LOCATION', 'CONTACT').required();

const ExampleHeader = Joi.object({
    header_text: Joi.array().items(Joi.string().required()).optional(),
    header_handle: Joi.array().items(Joi.string().required()).optional()
})

const ExampleBody = Joi.object({
    body_text: Joi.array().items(Joi.array().items(Joi.string().required()).required()).optional(),
})

const ExampleButton = Joi.object({
    type: ComponentButtonType,
    text: Joi.string().required(),
    phone_number: Joi.string().optional(),
    url: Joi.string().optional()
})

const ExampleURL = Joi.array().items(Joi.string().uri().required()).required();

const TemplateComponent = Joi.alternatives().try(
    Joi.object({
        type: ComponentType,
        format: ComponentFormat,
        text: Joi.string().required(),
        example: ExampleHeader
    }),
    Joi.object({
        type: ComponentType,
        text: Joi.string().required(),
        example: ExampleBody
    }),
    Joi.object({
        type: ComponentType,
        text: Joi.string().required()
    }),
    Joi.object({
        type: ComponentType,
        buttons: Joi.array().items(ExampleButton).required()
    }),
    Joi.object({
        type: ComponentType,
        text: Joi.string().required(),
        url: Joi.string().required(),
        example: ExampleURL
    })
);

const CreateTemplateSchema = Joi.object({
    category: TemplateCategory,
    name: Joi.string(),
    language: Joi.string(),
    components: Joi.array().items(TemplateComponent).optional()
})



const TemplateField = Joi.string().valid('id', 'category', 'components', 'language', 'message_send_ttl_seconds', 'name', 'previous_category', 'quality_score', 'rejected_reason', 'status').required();

const TemplateFields = Joi.array().items(TemplateField).required();

const GetMessageTemplatesQueryParams = Joi.object({
    fields: TemplateFields,
    limit: Joi.number().optional()
})

const MediaOptions = Joi.object({
    caption: Joi.string().optional()
})

const DocumentOptions = Joi.object({
    caption: Joi.string().optional(),
    filename: Joi.string().optional()
})

const CoordinateOptions = Joi.object({
    latitude: Joi.string().required(),
    longitude: Joi.string().required()
})

const LocationOptions = Joi.object({
    name: Joi.string().optional(),
    address: Joi.string().optional()
})



const AddressObject = Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zip: Joi.string().optional(),
    country: Joi.string().optional(),
    country_code: Joi.string().optional(),
    type: Joi.string().valid('HOME', 'WORK').optional()
})

const EmailObject = Joi.object({
    email: Joi.string().email().required(),
    type: Joi.string().valid('HOME', 'WORK').optional()
})

const PhoneObject = Joi.object({
    phone: Joi.string().required(),
    type: Joi.string().valid('CELL', 'MAIN', 'IPHONE', 'HOME', 'WORK').optional(),
    wa_id: Joi.string().optional()
})

const UrlObject = Joi.object({
    url: Joi.string().uri().required(),
    type: Joi.string().valid('HOME', 'WORK').optional()
})

const ContactOptions = Joi.object({
    addresses: Joi.array().items(AddressObject).optional(),
    birthday: Joi.string().optional(),
    emails: Joi.array().items(EmailObject).optional(),
    name: Joi.object({
        formatted_name: Joi.string().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().optional(),
        middle_name: Joi.string().optional(),
        suffix: Joi.string().optional(),
        prefix: Joi.string().optional()
    }).required(),
    org: Joi.object({
        company: Joi.string().optional(),
        department: Joi.string().optional(),
        title: Joi.string().optional()
    }).optional(),
    phones: Joi.array().items(PhoneObject).optional(),
    urls: Joi.array().items(UrlObject).optional()

})

const ButtonsOptions = Joi.object().pattern(Joi.string(), Joi.string().required())

const InteractiveOptions = Joi.object({
    footer: Joi.string().optional(),
    header: Joi.object({
        type: Joi.string().valid('text', 'video', 'image', 'document').required(),
        text: Joi.string().optional(),
        video: MediaObject.optional(),
        image: MediaObject.optional(),
        document: MediaObject.optional()
    }).optional()
})

const RowObject = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().optional()
})

const SectionOptions = Joi.object({
    title: Joi.string().optional(),
    rows: Joi.array().items(RowObject).required()
})


const WhatsAppMessageContract = Joi.object({
    sender: Joi.string().required(),
    wamid: Joi.string().required(),
    data: Joi.object().required(),
    timestamp: Joi.number().required(),
    phoneNumberId: Joi.any().required(),
    type: Joi.string().valid('text', 'image', 'document', 'audio', 'video', 'sticker', 'location', 'contacts', 'button', 'list').required()

})

const WhatsAppStatusContract = Joi.object({
    wamid: Joi.string().required(),
    timestamp: Joi.number().required(),
    status: Joi.string().valid('sent', 'delivered', 'read').required(),
    phoneNumberId: Joi.any().required()
})

const WhatsAppResultContract = Joi.object({
    input: Joi.number().required(),
    phone: Joi.string().required(),
    wamid: Joi.string().required()
})

const WhatsAppTemplateResultContract = Joi.object({
    id: Joi.number().required(),
    status: Joi.string().required(),
    category: Joi.string().required()
})

const TextSchema = Joi.object({
    body: Joi.string().required(),
    options: TextOptions
});

const ImageSchema = Joi.object({
    link: Joi.string().uri().optional(),
    id: Joi.string().optional(),
    options: TextOptions
})

const DocumentSchema = Joi.object({
    link: Joi.string().uri().optional(),
    id: Joi.string().optional(),
    options: DocumentOptions
})

const AudioSchema = Joi.object({
    link: Joi.string().uri().optional(),
    id: Joi.string().optional()
})

const VideoSchema = Joi.object({
    link: Joi.string().uri().optional(),
    id: Joi.string().optional(),
    options: MediaOptions
})

const SendTemplateSchema = Joi.object({
    name: Joi.string().required(),
    language: Joi.string().required(),
    components: Joi.array().items(ComponentOptions).optional()
})

module.exports = {
    ConfigSchema,
    TextSchema,
    ImageSchema,
    QuerySchema,
    TemplateCategory,
    TemplateComponent,
    CreateTemplateSchema,
    SendTemplateSchema,
    GetMessageTemplatesQueryParams,
    MediaOptions,
    DocumentOptions,
    CoordinateOptions,
    LocationOptions,
    CurrencyObject,
    DateTimeObject,
    MediaObject,
    ParameterObject,
    ComponentOptions,
    AddressObject,
    EmailObject,
    PhoneObject,
    UrlObject,
    ContactOptions,
    ButtonsOptions,
    InteractiveOptions,
    SectionOptions,
    WhatsAppMessageContract,
    WhatsAppStatusContract,
    WhatsAppResultContract,
    WhatsAppTemplateResultContract,
    DocumentSchema,
    AudioSchema,
    VideoSchema
}