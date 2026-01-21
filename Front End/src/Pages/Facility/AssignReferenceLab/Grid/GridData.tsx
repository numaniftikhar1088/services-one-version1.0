import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react';
import useLang from "Shared/hooks/useLanguage";
import { Loader } from '../../../../Shared/Common/Loader';
import Row from './Row';

export const GridData: React.FC<{}> = () => {
    const { t } = useLang()
    //  ************************* Loader *********************
    const [loading, setLoading] = useState(false);
    //  ************************* Pagination start *********************

        return (
            <>
            <TableHead>
            <TableRow className="h-50px">
                <TableCell></TableCell>
                <TableCell>
                <input
                    type="text"
                    name="firstName"
                    className="form-control bg-white mb-3 mb-lg-0"
                    placeholder={t("Search ...")}
                    value=''
                />
                </TableCell>
                <TableCell>
                <input
                    type="text"
                    name="firstName"
                    className="form-control bg-white mb-3 mb-lg-0"
                    placeholder={t("Search ...")}
                    value=''
                />
                </TableCell>
                <TableCell>
                <input
                    type="text"
                    name="lastName"
                    className="form-control bg-white mb-3 mb-lg-0"
                    placeholder={t("Search ...")}
                    value=''
                />
                </TableCell>
                <TableCell>
                <input
                    type="text"
                    name="email"
                    className="form-control bg-white mb-3 mb-lg-0"
                    placeholder={t("Search ...")}
                    value=''
                />
                </TableCell>
                <TableCell>
                <input
                    type="text"
                    name="userType"
                    className="form-control bg-white mb-3 mb-lg-0"
                    placeholder={t("Search ...")}
                    value=''
                />
                </TableCell>
                <TableCell>
                <input
                    type="text"
                    name="npiNo"
                    className="form-control bg-white mb-3 mb-lg-0"
                    placeholder={t("Search ...")}
                    value=''
                />
                </TableCell>
                <TableCell>
                <input
                    type="text"
                    name="userGroup"
                    className="form-control bg-white mb-3 mb-lg-0"
                    placeholder={t("Search ...")}
                    value=''
                />
                </TableCell>
                <TableCell>
                <input
                    type="text"
                    name="userGroup"
                    className="form-control bg-white mb-3 mb-lg-0"
                    placeholder={t("Search ...")}
                    value=''
                />
                </TableCell>
            </TableRow>

            <TableRow className="h-40px">
                <TableCell style={{ width: '100px' }}>
                {t("ACTIONS")}
                </TableCell>
                <TableCell className="min-w-200px">
                {t("Reference Lab")}
                </TableCell>
                <TableCell className="min-w-200px">
                {t("Lab Type")}
                </TableCell>
                <TableCell className="min-w-150px">
                {t("Code")}
                </TableCell>
                <TableCell className="min-w-200px">
                {t("Requisition type")}
                </TableCell>
                <TableCell className="min-w-200px">
                {t("Group")}
                </TableCell>
                <TableCell className="min-w-200px">
                {t("Insurance")}
                </TableCell>
                <TableCell className="min-w-100px">
                {t("Gender")}
                </TableCell>
                <TableCell className="min-w-100px">
                {t("Status")}
                </TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {loading ? (
                <TableCell colSpan={8} className="">
                <Loader />
                </TableCell>
            ) : (
                <>
                <Row />
                </>
            )}
            </TableBody>
            </>
        );
}
