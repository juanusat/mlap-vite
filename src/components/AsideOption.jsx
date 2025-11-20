import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import MyAsideButton1 from './MyAsideButton1';
import './AsideOption.css';

const AsideOption = ({ option, onToggle }) => {
    const isGroup = option.children && option.children.length > 0;

    const [isExpanded, setIsExpanded] = useState(false);

    if (isGroup) {
        return (
            <div className="aside-group">
                <div
                    className="aside-group-header"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                >
                    <div className="button-content">
                        <span>{option.icon}</span>
                        {option.label}
                    </div>
                    <div className='down-up'>
                        {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                    </div>

                </div>

                {isExpanded && (
                    <div className="aside-submenu">
                        {option.children.map((childOption) => (
                            <MyAsideButton1
                                key={childOption.href}
                                href={childOption.href}
                                icon={childOption.icon}
                                onClick={onToggle}
                                className="submenu-item"
                            >
                                {childOption.label}
                            </MyAsideButton1>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <MyAsideButton1
            href={option.href}
            icon={option.icon}
            onClick={onToggle}
        >
            {option.label}
        </MyAsideButton1>
    );
};

export default AsideOption;