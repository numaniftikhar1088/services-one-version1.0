CREATE TABLE [dbo].[tblLogs] (
    [Id]               NVARCHAR (300) NOT NULL,
    [CreateDate]       DATETIME2 (7)  CONSTRAINT [DF__tblLogs__CreateD__160F4887] DEFAULT (getdate()) NOT NULL,
    [Title]            NVARCHAR (MAX) NOT NULL,
    [Description]      NVARCHAR (MAX) NOT NULL,
    [PathName]         NVARCHAR (MAX) NULL,
    [Status]           INT            NULL,
    [LogType]          INT            CONSTRAINT [DF__tblLogs__LogType__17036CC0] DEFAULT ((1)) NOT NULL,
    [UserId]           NVARCHAR (300) NULL,
    [IsViewed]         BIT            CONSTRAINT [DF__tblLogs__IsViewe__17F790F9] DEFAULT ((0)) NOT NULL,
    [ViewedTime]       DATETIME2 (7)  NULL,
    [IsRead]           BIT            CONSTRAINT [DF__tblLogs__IsRead__18EBB532] DEFAULT ((0)) NOT NULL,
    [ReadTime]         DATETIME2 (7)  NULL,
    [ExceptionMessage] NVARCHAR (MAX) NULL,
    [UpdateTime]       DATETIME2 (7)  NULL,
    [TypeInfo]         NVARCHAR (MAX) NULL,
    [ExtentionData]    NVARCHAR (MAX) NULL,
    CONSTRAINT [PK__tblLogs__3214EC074A03E078] PRIMARY KEY CLUSTERED ([Id] ASC)
);

