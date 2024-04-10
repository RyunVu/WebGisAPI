import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { BsSun, BsMoon, BsPaintBucket } from 'react-icons/bs';
import { BiLogOutCircle, BiHome } from 'react-icons/bi';
import { AiOutlineDropbox, AiOutlineRight } from 'react-icons/ai';

import profileImg from '../../../assets/images/avatar.jpg';

import styles from './layout.module.scss';

const AdminLayout = () => {
    const [toggled, setToggled] = useState(false);
    const [theme, setTheme] = useState(false);

    const handleToggle = () => {
        setToggled(!toggled);
    };

    const handleTheme = () => {
        setTheme(!theme);
    };

    const handleLogout = () => {
        localStorage.clear();
    };

    return (
        <>
            <div className={theme ? clsx(styles.wrapper, styles.dark) : styles.wrapper}>
                <div className={styles.container}>
                    <input id="menu__toggle" type="checkbox" />
                    <label className={styles.menu__btn} for="menu__toggle">
                        <span></span>
                    </label>
                    <nav className={toggled ? clsx(styles.sidebar, styles.close) : styles.sidebar}>
                        <header>
                            <div className={styles.imageText}>
                                <span className={styles.image}>
                                    <img src={profileImg} alt="" />
                                </span>

                                <div className={clsx(styles.logoText, styles.text)}>
                                    <span className={styles.name}>Admin</span>
                                    <span className={styles.profession}>Store</span>
                                </div>
                            </div>
                            <div className={styles.toggle} onClick={handleToggle}>
                                <AiOutlineRight />
                            </div>
                        </header>

                        <div className={styles.menuBar}>
                            <div className={styles.menu}>
                                <ul className="menu-links ps-0">
                                    <li className="nav-link">
                                        <Link to="/admin">
                                            <BiHome className={styles.icon} />
                                            <span className={clsx(styles.text, 'nav-text')}>Dashboard</span>
                                        </Link>
                                    </li>

                                    <li className="nav-link">
                                        <Link to="/admin/categories">
                                            <AiOutlineDropbox className={styles.icon} />
                                            <span className={clsx(styles.text, 'nav-text')}>Loại sản phẩm</span>
                                        </Link>
                                    </li>

                                    <li className="nav-link">
                                        <Link to="/admin/products">
                                            <BsPaintBucket className={styles.icon} />
                                            <span className={clsx(styles.text, 'nav-text')}>Sản phẩm</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div className={styles.bottomContent}>
                                <li className="">
                                    <Link to="/" onClick={handleLogout}>
                                        <BiLogOutCircle className={styles.icon} />
                                        <span className={clsx(styles.text, 'nav-text')}>Logout</span>
                                    </Link>
                                </li>

                                <li className={styles.mode} onClick={handleTheme}>
                                    <div className={styles.sunMoon}>
                                        <BsMoon className={clsx(styles.icon, styles.moon)} />
                                        <BsSun className={clsx(styles.icon, styles.sun)} />
                                    </div>
                                    {theme ? (
                                        <span className={clsx(styles.text)}>Dark mode</span>
                                    ) : (
                                        <span className={clsx(styles.text)}>Light mode</span>
                                    )}

                                    <div className={styles.toggleSwitch}>
                                        <span className={styles.switch}></span>
                                    </div>
                                </li>
                            </div>
                        </div>
                    </nav>

                    <div className={clsx(styles.home, 'py-3 px-4')}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
