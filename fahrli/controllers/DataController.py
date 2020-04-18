from sqlalchemy import create_engine
from sqlalchemy import Table, Column, String, MetaData, DateTime, BigInteger, Integer
from fahrli.models.FAHEntry import FAHEntry
import config
import datetime

dataEngine = create_engine(config.fahstats_db_string)
metadata = MetaData(dataEngine)
fahStatsTable = Table("fahstats", metadata, 
	Column('EntryId', Integer, primary_key=True), 
	Column('DateAdded', DateTime), 
	Column('UserId', BigInteger),  
	Column('TeamId', BigInteger), 
	Column('UserName', String),
	Column('Credit', BigInteger),
	Column('WorkUnits', BigInteger))

metadata.create_all() 


def WriteFAHEntry(FAHEntry):
	with dataEngine.connect() as db:
		db.execute(fahStatsTable.insert().values(DateAdded = FAHEntry.DateAdded,
												UserId = FAHEntry.UserId,
												TeamId = FAHEntry.TeamId,
												UserName = FAHEntry.UserName,
												Credit = FAHEntry.Credit,
												WorkUnits = FAHEntry.WorkUnits))

def ReadFAHEntries():
	ret = []
	with dataEngine.connect() as db:
		for row in db.execute('select * from fahstats order by "DateAdded"'):
			ret.append(FAHEntry(row[0], row[1], row[2], row[3], row[4], row[5], row[6]))
	return ret

def GetMostRecentFAHRun():
	ret = []
	with dataEngine.connect() as db:
		timestamp = db.execute('select "DateAdded" from fahstats order by "DateAdded" desc limit 1').fetchone()

		if(timestamp is not None):
			timestamp = timestamp.DateAdded
			for row in db.execute('select * from fahstats where "DateAdded" = \'{timestamp}\''.format(timestamp=timestamp.strftime("%Y-%m-%d, %H:%M:%S.%f"))):
				ret.append(FAHEntry(row[0], row[1], row[2], row[3], row[4], row[5], row[6]))
	return ret