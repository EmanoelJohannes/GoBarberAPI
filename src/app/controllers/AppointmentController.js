import Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt'

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointments';
import Notification from '../schemas/Notification'
import { locale } from 'moment';

class AppointmentController {
    async index (req, res){

        const { page = 1 } = req.query;

        const appointments = await Appointment.findAll({
            where: {user_id: req.userId, canceled_at: null},
            order: ['date'],
            attributes: ['id', 'date'],
            limit: 5,
            offset: (page-1) * 5,
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'url']
                        }
                    ]
                }
            ]
        });

        return res.json(appointments);
    }

    async store (req, res){

        const { provider_id, date } = req.body;

        const checkIsProvider = await User.findOne({
            where: {id: provider_id, provider: true}
        });

        if (!checkIsProvider){
            return res.status(401).json({error: "Você só pode criar agendamento se for um provider."});
        }

        if (provider_id == req.userId){
            return res.status(400).json({error: "Você não pode marcar consigo mesmo."});
        }

        // Verifica se a hora do agendamento é valida
        const hourStart = startOfHour(parseISO(date));

        if (isBefore(hourStart, new Date())){
            return res.status(400).json({error: "Datas do passado não são permitidas"});
        }

        // Verifica se a hora já não está ocupada
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart
            }
        });

        console.log(hourStart, date);

        if (checkAvailability){
            return res.status(400).json({error: "Horário não está vago"});
        }

        // Cria agendamento
        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date
        });


        // Notificando prestador de serviço
        const user = await User.findByPk(req.userId); 
        const formatedDate = format(
            hourStart,
            "dd 'de' MMM', às 'H:mm'h'", // 22 de Junho, às 8:40h
            { locale: pt }
        )

        await Notification.create({
            content: `Novo agendamento de ${user.name} para dia ${formatedDate}`,
            user: provider_id
        })

        return res.json(appointment);
    }

    async delete (req, res){
        const appointment = await Appointment.findByPk(req.params.id);

        if (appointment.user_id != req.userId){
            return res.status(401).json({error: "Voce nao tem permissao para cancelar esse agendamento."});
        }

        const dateWithSub = subHours(appointment.date, 2);

        if (isBefore(dateWithSub, newDate())){
            return res.status(401).json({error: "Voce só pode cancelar agendamento com no minimo duas horas de antecendia."});
        }

        appointment.canceled_at = new Date();

        await appointment.save();

        return res.json(appointment);
    }
}

export default new AppointmentController();