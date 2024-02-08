import moment from "moment";
import 'moment/locale/fr';

export const tempsEcoule = (datePost) => {
    moment.locale('fr'); 
    const dateActuelle = moment();
    const datePoste = moment(datePost);
    const difference = dateActuelle.diff(datePoste);
    const duree = moment.duration(difference);
    return moment.duration(duree).humanize();
};
 