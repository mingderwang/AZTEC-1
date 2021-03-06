import React from 'react';
import PropTypes from 'prop-types';
import BN from 'bn.js';
import Web3Service from '~/helpers/Web3Service';
import {
    emptyIntValue,
} from '~/ui/config/settings';
import {
    inputTransactionShape,
} from '~/ui/config/propTypes';
import depositSteps from '~/ui/steps/deposit';
import getGSNConfig from '~/ui/helpers/getGSNConfig';
import makeAsset from '~/ui/utils/makeAsset';
import parseInputTransactions from '~/ui/utils/parseInputTransactions';
import StepsHandler from '~/ui/views/handlers/StepsHandler';
import DepositContent from '~/ui/views/DepositContent';

const Deposit = ({
    currentAccount,
    assetAddress,
    transactions,
    numberOfOutputNotes,
    userAccess,
}) => {
    const {
        address: currentAddress,
    } = currentAccount;

    const fetchInitialData = async () => {
        const gsnConfig = await getGSNConfig();
        const {
            isGSNAvailable,
            proxyContract,
        } = gsnConfig;
        const asset = await makeAsset(assetAddress);
        const parsedTransactions = parseInputTransactions(transactions);
        const amount = parsedTransactions.reduce((sum, tx) => sum + tx.amount, 0);

        let allowanceSpender = Web3Service.getAddress('AccountRegistry');
        let publicOwner = allowanceSpender;
        let sender = publicOwner;
        let steps = depositSteps[isGSNAvailable ? 'gsn' : 'metamask'];
        if (isGSNAvailable
            && parsedTransactions.some(({ to }) => to !== currentAddress)
        ) {
            allowanceSpender = Web3Service.getAddress('ACE');
            publicOwner = currentAddress;
            sender = proxyContract;
            steps = depositSteps.gsnTransfer;
        }

        const tokenSupportsPermit = asset.supportsPermit;
        if (tokenSupportsPermit) {
            steps = depositSteps.gsnWithPermit;
        }

        const allowance = await Web3Service
            .useContract('ERC20')
            .at(asset.linkedTokenAddress)
            .method('allowance')
            .call(
                currentAddress,
                allowanceSpender,
            );
        const approvedERC20Allowance = new BN(allowance);
        const erc20Amount = asset.scalingFactor.mul(new BN(amount));
        const requestedAllowance = erc20Amount;
        if (approvedERC20Allowance.gte(requestedAllowance)) {
            steps = steps.filter(({ name }) => name !== 'approveERC20'
              && name !== 'permitERC20');
        }

        return {
            steps,
            retryWithMetaMaskStep: depositSteps.metamask.slice(-1)[0],
            proofType: 'DEPOSIT_PROOF',
            currentAccount,
            currentAddress,
            assetAddress,
            asset,
            transactions: parsedTransactions,
            publicOwner,
            sender,
            spender: sender,
            amount,
            erc20Amount,
            requestedAllowance,
            allowanceSpender,
            numberOfOutputNotes,
            userAccess,
            isGSNAvailable,
        };
    };

    return (
        <StepsHandler
            testId="steps-deposit"
            fetchInitialData={fetchInitialData}
            Content={DepositContent}
        />
    );
};

Deposit.propTypes = {
    currentAccount: PropTypes.shape({
        address: PropTypes.string.isRequired,
    }).isRequired,
    assetAddress: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(inputTransactionShape).isRequired,
    numberOfOutputNotes: PropTypes.number,
    userAccess: PropTypes.arrayOf(PropTypes.string),
};

Deposit.defaultProps = {
    numberOfOutputNotes: emptyIntValue,
    userAccess: [],
};

export default Deposit;
