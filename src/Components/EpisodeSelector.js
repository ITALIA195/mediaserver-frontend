import React from 'react';
import { Tooltip } from '@material-ui/core'
import { Fetch } from 'react-request';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { getEpisodeUrl, getAnimeListAPI } from '../Common';
import Loading from './Loading';

class EpisodeSelector extends React.Component {
    componentDidMount() {
        let params = this.props.match.params;
        this.setState({
            anime: params.anime,
            season: params.season
        });
    }

    render() {
        // Wait for componentDidMount
        if (!this.state) return null;

        const api = 'http://192.168.1.111/api/v1/anime/{anime}/{season}'.format(this.state);

        return (
            <Fetch url={api}>
                {({ fetching, failed, data }) => {
                    if (fetching) {
                        return <Loading />
                    }

                    if (failed) {
                        return <h1>{data?.error ?? "Failed to connect to remote API"}</h1>
                    }

                    if (data) {
                        let seasonInfo = data.data;
                            
                        // No episodes available => Don't render the page
                        if (!seasonInfo.episodes || seasonInfo.episodes.length === 0) {
                            return <h1>No episodes available</h1>
                        }

                        if (seasonInfo.episodesCount === 1 && seasonInfo.availableEpisodes === 1) {
                            return <Redirect to={getEpisodeUrl(seasonInfo.episodes[0].id)} />
                        }

                        return (
                            <div className="EpisodeSelector">
                                <div className="EpisodeSelector-Header">
                                    <h1>{seasonInfo.displayName}</h1>
                                    <h3>Select the episode you want to watch</h3>
                                </div>
                                <div className="EpisodeSelector-Selector">
                                    {seasonInfo.episodes.map(episode => {
                                        if (episode.available === undefined || episode.available === true) {
                                            return (
                                                <div className="EpisodeSelector-EpisodePanel">
                                                    <Link key={episode.id} to={getEpisodeUrl(episode.id)}>
                                                        {episode.displayName}
                                                    </Link>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="EpisodeSelector-EpisodePanel">
                                                <Tooltip title="Not available" placement="right">
                                                    <a className="EpisodeSelector-NotAvailable">
                                                        {episode.displayName}
                                                    </a>
                                                </Tooltip>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }

                    return null;
                }}
            </Fetch>
        );
    }
}

export default withRouter(EpisodeSelector);
