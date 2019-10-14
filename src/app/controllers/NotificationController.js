import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
    async index(req, res){
        const checkIsProvider = await User.findOne({
            where: {id: req.userId, provider: true}
        });

        if (!checkIsProvider){
            return res.status(401).json({error: "Somente prestadores podem carregar as notificações."});
        }

        const notifications = await Notification.find({
            user: req.userId,
        }).sort({ createdAt: 'desc' }).limit(5);

        return res.json(notifications);
    }

    async update(req, res){

        //Torna true o "visualizado" da notificação

        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            {read: true},
            {new: true} // para retornar já atualizado
        );

        return res.json(notification);
    }
}

export default new NotificationController();