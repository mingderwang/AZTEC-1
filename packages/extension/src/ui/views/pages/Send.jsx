import React from 'react';
import PropTypes from 'prop-types';
import {
    emptyIntValue,
} from '~ui/config/settings';
import makeAsset from '~uiModules/utils/asset';
import CombinedViews from '~ui/views/handlers/CombinedViews';
import SendConfirm from '~ui/views/SendConfirm';
import SendTransaction from '~ui/views/SendTransaction';

const Steps = [
    SendConfirm,
    SendTransaction,
];

const handleOnStep = (step) => {
    const newProps = {};
    switch (step) {
        case 1:
            newProps.autoStart = true;
            break;
        default:
    }

    return newProps;
};

const Send = ({
    assetAddress,
    sender,
    transactions,
    numberOfInputNotes,
}) => {
    const fetchInitialData = async () => {
        const asset = await makeAsset(assetAddress);
        const amount = transactions.reduce((sum, t) => sum + t.amount, 0);

        return {
            asset,
            sender,
            amount,
            transactions,
            numberOfInputNotes,
        };
    };
    return (
        <CombinedViews
            Steps={Steps}
            fetchInitialData={fetchInitialData}
            onStep={handleOnStep}
            autoClose
        />
    );
};

Send.propTypes = {
    assetAddress: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.shape({
        amount: PropTypes.number.isRequired,
        to: PropTypes.string.isRequired,
    })).isRequired,
    numberOfInputNotes: PropTypes.number,
};

Send.defaultProps = {
    numberOfInputNotes: emptyIntValue,
};

export default Send;