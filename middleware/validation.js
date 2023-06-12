const yup = require('yup');

module.exports.validateLogin = (req, res, next) => {
    try {
        const schema = yup.object({
            username: yup.string().required(),
            password: yup.string().required()
        });

        let data = schema.validateSync(req.body, { abortEarly: false, stripUnknown: true });
        return next();
    } catch(e) {
        return res.status(422).json({ errors: e.errors });
    }
}

module.exports.validateAddUser = (req, res, next) => {
    try {
        const schema = yup.object({
            username: yup.string().required(),
            password: yup.string().required(),
            isAdmin: yup.boolean().required()
        });

        let data = schema.validateSync(req.body, { abortEarly: false, stripUnknown: true });
        return next();
    } catch(e) {
        return res.status(422).json({ errors: e.errors });
    }
}

module.exports.validateEditUser = (req, res, next) => {
    try {
        const schema = yup.object({
            username: yup.string(),
            password: yup.string(),
            isAdmin: yup.boolean()
        });

        let data = schema.validateSync(req.body, { abortEarly: false });

        let fieldsCanBeUpdated = ['username', 'isAdmin', 'password']
        let dataToUpdate = Object.fromEntries(Object.entries(data).filter(([key]) => fieldsCanBeUpdated.includes(key)))

        if(!Object.keys(dataToUpdate).length){
            return res.status(422 ).json({ message: 'Fields for update are missing'});
        }
        req.dataToUpdate = dataToUpdate;
        return next();
    } catch(e) {
        return res.status(422).json({ errors: e.errors });
    }
}

module.exports.validateCreateGroup = (req, res, next) => {
    try {
        const schema = yup.object({
            name: yup.string().required()
        });

        let data = schema.validateSync(req.body, { abortEarly: false, stripUnknown: true });
        return next();
    } catch(e) {
        return res.status(422).json({ errors: e.errors });
    }
}
module.exports.validateAddMembers = (req, res, next) => {
    try {
        const schema = yup.object({
            members: yup.array().of(yup.string()).required()
        });

        let data = schema.validateSync(req.body, { abortEarly: false, stripUnknown: true });
        return next();
    } catch(e) {
        return res.status(422).json({ errors: e.errors });
    }
}

module.exports.validateSendMessage = (req, res, next) => {
    try {
        const schema = yup.object({
            message: yup.string().required()
        });

        let data = schema.validateSync(req.body, { abortEarly: false, stripUnknown: true });
        return next();
    } catch(e) {
        return res.status(422).json({ errors: e.errors });
    }
}