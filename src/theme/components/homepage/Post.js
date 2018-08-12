import React, { Component } from 'react';
import Moment from 'moment';
import Axios from 'axios';
import nl2br from 'nl2br';

import Spinner from '~/src/theme/components/homepage/Spinner';
import LinkPreview from '~/src/theme/components/homepage/LinkPreview';
import ConfigMain from '~/configs/main';


const PostHeader = ({ authorName, date }) => (
  <div className="top-head">
    <div className="profile-icon">
      <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/my-friends-9.png" alt="" />
    </div>
    <span className="col-heading">{authorName}</span>
    <span className="date">{Moment(date).format('DD.MM.YYYY')}</span>
  </div>
)

const CommentBox = () => (
  <div className="input-wp">
    <div className="input-filed">
      <input type="text" name="" placeholder="Write comment..." />
      <a href="#" className="camera-icon"><i className="fa fa-camera"></i></a>
    </div>
    <div className="bot-share-btns">
      <ul>
        <li><a href="#"><div className="icon-white text-blue"><i className="fa fa-share"></i></div></a></li>
        <li><a href="#"><div className="icon-white icon-blue"><i className="fa fa-thumbs-up"></i></div></a></li>
      </ul>
    </div>
  </div>
);

const Reaction = () => (
  <div className="likewp">
    <div className="thum-like">
      <i className="fa fa-thumbs-up" aria-hidden="true"></i>
    </div>
    <span>Anna +23 others</span>
    <span className="comments-txt">4 comments</span>
  </div>
);

const PostFooter = () => (
  <div className="bot-wp">
    <Reaction />
    <CommentBox />
  </div>
);

export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchMetaLoading: false,
      linkMeta: {},
    };
  }

  componentDidMount() {
    const { isContainUrl, url } = this.props;
    if (isContainUrl) this.fetchLinkMeta(url);
  }

  fetchLinkMeta(link) {
    this.setState({ isFetchMetaLoading: true });
    const linkMetaScraperEndpoint = `${ConfigMain.getLinkScraperServiceURL()}?url=${link}`;

    Axios.get(linkMetaScraperEndpoint)
      .then(({ data }) => {
        if (data.result.status == 'OK') {
          this.setState({ 
            linkMeta: data.meta, 
            isFetchMetaLoading: false 
          });
        }
      })
      .catch(error => this.setState({ isFetchMetaLoading: false }));
  }

  render() {
    const { isContainUrl } = this.props;
    const { authorName, date, message } = this.props.data;

    const linkSnippet = isContainUrl ?
      <LinkPreview 
        isLoading={this.state.isFetchMetaLoading}
        meta={this.state.linkMeta}
        loader={<Spinner shown={this.state.isFetchMetaLoading} />}
      /> : '';
  
    return (
      <div className="col-box-wp">
        <div className="main-comment-box">
          <PostHeader authorName={authorName} date={date} />
          <p dangerouslySetInnerHTML={{ __html: nl2br(message) }} />
          { linkSnippet }
          <PostFooter />
        </div>
      </div>
    );
  }
}
