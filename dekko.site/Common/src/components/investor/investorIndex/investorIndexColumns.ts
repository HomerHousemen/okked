const InvestorIndexColumns = [
  {
    Header: "Investor Name",
    accessor: "investorName",
    width: "295px",
    sortable: true,
  },
  {
    Header: "Investment Entity",
    accessor: "investmentEntity",
    width: "100px",
  },
  {
    Header: "Active",
    accessor: "isActive",
    width: "80px",
  } /*,
    {
        Header: '',
        accessor: 'delete',
        width: '40px',
    }*/,
];

export const getInvestorIndexColumns = (isInternal: boolean) => {
  if (!isInternal) return [InvestorIndexColumns[0]];
  return InvestorIndexColumns;
};
