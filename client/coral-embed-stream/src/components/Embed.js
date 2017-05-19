import React from 'react';
import t from 'coral-framework/services/i18n';

import {TabBar, Tab, TabContent, Button} from 'coral-ui';

import Stream from '../containers/Stream';
import Count from 'coral-plugin-comment-count/CommentCount';
import UserBox from 'coral-sign-in/components/UserBox';
import ProfileContainer from 'coral-settings/containers/ProfileContainer';
import RestrictedContent from 'coral-framework/components/RestrictedContent';
import ConfigureStreamContainer from 'coral-configure/containers/ConfigureStreamContainer';

export default class Embed extends React.Component {
  changeTab = (tab) => {
    switch(tab) {
    case 0:
      this.props.setActiveTab('stream');
      break;
    case 1:
      this.props.setActiveTab('profile');

      // TODO: move data fetching to profile container.
      this.props.data.refetch();
      break;
    case 2:
      this.props.setActiveTab('config');

      // TODO: move data fetching to config container.
      this.props.data.refetch();
      break;
    }
  }

  handleShowProfile = () => this.props.setActiveTab('profile');

  render () {
    const {activeTab, logout, viewAllComments, commentId} = this.props;
    const {asset: {totalCommentCount}} = this.props.root;
    const {loggedIn, isAdmin, user} = this.props.auth;

    const userBox = <UserBox user={user} onLogout={logout} onShowProfile={this.handleShowProfile}/>;

    return (
      <div>
        <div className="commentStream">
          <TabBar onChange={this.changeTab} activeTab={activeTab}>
            <Tab><Count count={totalCommentCount}/></Tab>
            <Tab>{t('framework.my_profile')}</Tab>
            <Tab restricted={!isAdmin}>Configure Stream</Tab>
          </TabBar>
          {
            commentId &&
              <Button
                cStyle='darkGrey'
                style={{float: 'right'}}
                onClick={viewAllComments}
              >
                {t('framework.show_all_comments')}
              </Button>
          }
          <TabContent show={activeTab === 'stream'}>
            { loggedIn ? userBox : null }
            <Stream data={this.props.data} root={this.props.root} />
          </TabContent>
          <TabContent show={activeTab === 'profile'}>
            <ProfileContainer />
          </TabContent>
          <TabContent show={activeTab === 'config'}>
            <RestrictedContent restricted={!loggedIn}>
              { loggedIn ? userBox : null }
              <ConfigureStreamContainer />
            </RestrictedContent>
          </TabContent>
        </div>
      </div>
    );
  }
}

Embed.propTypes = {
  data: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    error: React.PropTypes.object
  }).isRequired,
};
