import React, { Component } from 'react';
import {
    Loader,
    Block,
    Button,
    Text,
} from '@aztec/guacamole-ui';
import { BrowserRouter as Route, Link } from 'react-router-dom';

import ExtensionApi from '../../services/ExtensionApiService';

import './ApproveDomain.css';


class ApproveAssetForDomain extends Component {
    state ={

    }

    approveDomain = async () => {
        const {
            action: {
                data: {
                    response: {
                        domain,
                        asset,
                    },
                },
            },
            address,
        } = this.props;
        console.log(this.props);
        await ExtensionApi.auth.approveDomain({
            domain,
            address,
        });
    }


    render() {
        if (!this.props.action) {
            return (
                <Block style={{
                    background: 'linear-gradient(115deg, #808DFF 0%, #9FC4FF 100%, #7174FF 100%)',
                }}
                >
                    <Loader
                        theme="primary"
                        hasBackground
                    />
                </Block>
            );
        }

        // we want to always render a router depending on the page we want to handle the url
        // we then render a react router and parse the query string for handling actions.
        // the extension ui will have a different flow

        const {
            action: {
                data: {
                    response: {
                        domain,
                        asset,
                    },
                },
            },
        } = this.props;
        return (
            <Block
                stretch
                padding="xl"
                align="center"
                background="white"
            >

                <Text
                    text="The page is requesting access to your AZTEC assets"
                    size="l"
                    color="primary"
                    weight="semibold"
                />
                <Text
                    text={`${domain} is requesting the access.`}
                    showEllipsis
                    color="label"
                    className="wrap"
                    size="s"
                    weight="light"
                />
                <div>
                    <br />
                    <br />
                    <Button
                        text="Approve"
                        onClick={() => this.approveDomain()}
                    />
                </div>
            </Block>
        );
    }
}

export default ApproveAssetForDomain;
