import React from 'react';
import classNames from 'classnames';
import { Tab, TabList, TabPanel, useTabState } from 'reakit/Tab';

import { label } from './labels';

import './detailsPane.scss';

const getOverviewItems = entries => {
    const materials = new Set();
    const labor = new Set();
    const tools = new Set();
    const funding = new Set();
    entries.forEach(entry => {
        entry.offers.materials.forEach(item => materials.add(item));
        entry.offers.labor.forEach(item => labor.add(item));
        entry.offers.tools.forEach(item => tools.add(item));
        entry.offers.funding.forEach(item => funding.add(item));
    });
    return {
        materials: [...materials],
        labor: [...labor],
        tools: [...tools],
        funding: [...funding],
    };
};

const DetailsPane = props => {
    const {
        onClose,
        marker: { zip, entries },
    } = props;

    const overviewItems = getOverviewItems(entries);
    const tabs = useTabState();

    const renderOverviewForType = (type, items) => {
        if (items.length === 0) {
            return null;
        }
        return (
            <div className={classNames('overview-section', type)}>
                <div className="head">{label(type, true)}</div>
                <div className="body">
                    <ul>
                        {items.map(item => (
                            <li key={item}>{label(item, true)}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    const renderOverview = () => {
        return (
            <>
                {renderOverviewForType('materials', overviewItems.materials)}
                {renderOverviewForType('labor', overviewItems.labor)}
                {renderOverviewForType('tools', overviewItems.tools)}
                {renderOverviewForType('funding', overviewItems.funding)}
            </>
        );
    };

    const renderResponses = () => {
        const infoFields = [
            'name',
            'email',
            'phone',
            'organization',
            'comments',
        ];
        return entries.map((entry, index) => {
            const { offers } = entry;
            return (
                <div className="response-section" key={index}>
                    <div className="info">
                        {infoFields.map(field => {
                            const val = entry[field];
                            if (!val) {
                                return null;
                            }
                            return (
                                <div className="field" key={field}>
                                    <b className="key">
                                        {field}
                                        {': '}
                                    </b>
                                    {val}
                                </div>
                            );
                        })}
                    </div>
                    <div className="offers">
                        {['materials', 'labor', 'tools', 'funding'].map(
                            type => {
                                if (offers[type] && offers[type].length) {
                                    return (
                                        <div
                                            key={type}
                                            className={classNames(
                                                'offer',
                                                type
                                            )}
                                        >
                                            <b className="key">
                                                {label(type)}
                                                {': '}
                                            </b>
                                            {offers[type]
                                                .map(offer =>
                                                    label(offer, true)
                                                )
                                                .join(', ')}
                                        </div>
                                    );
                                }
                                return null;
                            }
                        )}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="details-pane">
            <h3>Responses from {zip}</h3>
            <button
                className="close-button"
                onClick={onClose}
                aria-label="Close"
            >
                &times;
            </button>
            <TabList>
                <Tab {...tabs}>Overview</Tab>
                <Tab {...tabs}>Individual responses</Tab>
            </TabList>
            <TabPanel className="tab-panel" {...tabs}>
                {renderOverview()}
            </TabPanel>
            <TabPanel className="tab-panel" {...tabs}>
                {renderResponses()}
            </TabPanel>
        </div>
    );
};

export default DetailsPane;
