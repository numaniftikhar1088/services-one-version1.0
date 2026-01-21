CREATE TABLE [dbo].[tblStates] (
    [ID]        INT            IDENTITY (1, 1) NOT NULL,
    [StateCode] NVARCHAR (MAX) NULL,
    [StateName] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblStates] PRIMARY KEY CLUSTERED ([ID] ASC)
);

