import React from 'react';
import { ReactComponent as Dashboard} from './dashboard_icon.svg'
import { ReactComponent as Chat} from './chat_icon.svg'
import { ReactComponent as Game} from './game_icon.svg'
import { ReactComponent as LeaderBoard} from './leaderboard_icon.svg'
import { ReactComponent as Logout} from './logout_icon.svg'
import { ReactComponent as setting} from './setting_icon.svg'
import { ReactComponent as Tournament} from './tournament_icon.svg'
import { ReactComponent as UserName} from './UserName.svg'
import { ReactComponent as Password} from './Password.svg'
import { ReactComponent as Notification} from './notification.svg'
import { ReactComponent as topBarSearch} from './topBarSearch.svg'
import { ReactComponent as Achievment1} from './achiev_1.svg'
import { ReactComponent as Achievment2} from './achiev_2.svg'
import { ReactComponent as Achievment3} from './achiev_3.svg'
import { ReactComponent as Achievment4} from './achiev_4.svg'
import { ReactComponent as GoldIcon} from './goldIcon.svg'
import { ReactComponent as SilverIcon} from './silverIcon.svg'
import { ReactComponent as CopperIcon} from './copperIcon.svg'
import { ReactComponent as view } from './view.svg'
import { ReactComponent as bracket } from './bracket.svg'
import { ReactComponent as history } from './history.svg'



const icons = {
    dashboard: Dashboard,
    chat: Chat,
    game: Game,
    leaderboard: LeaderBoard,
    logout: Logout,
    setting: setting,
    tournament: Tournament,
    username: UserName,
    password: Password,
    notification: Notification,
    topBarSearch: topBarSearch,
    achievment1: Achievment1,
    achievment2: Achievment2,
    achievment3: Achievment3,
    achievment4: Achievment4,
    gold : GoldIcon,
    silver : SilverIcon,
    copper : CopperIcon,
    view : view,
    bracket : bracket,
    history : history
}



const Icon = ({ name, className}) => {
    const SvgIcon = icons[name];
    return <SvgIcon className={className}/>;
};

export default Icon;