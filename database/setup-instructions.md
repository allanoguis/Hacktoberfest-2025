# Supabase Database Setup Instructions

## Quick Start Guide

### Step 1: Execute Population Script
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `database/populate-data.sql`
3. Paste and run the script
4. Verify success (should see "10 rows affected" messages)

### Step 2: Validate Data
1. Copy contents of `database/data-validation.sql`
2. Run validation queries
3. Check results match expected values

## Expected Results After Population

### Users Table
- **10 authenticated users** (user_001 to user_010)
- **0 Guest entries** (000000 ID reserved for system)
- **Complete profiles** with emails, names, and avatars

### Games Table  
- **20+ game sessions** across all users
- **Varied scores**: 2,800 - 55,000 points
- **Time diversity**: 25 - 120+ second completion times
- **Device mix**: Desktop, mobile, tablet usage

### Leaderboard Display
- **Top 10 players** shown with high scores
- **No Guest entries** in populated results
- **Proper pagination** works with multiple users
- **Search functionality** finds real user data

## File Descriptions

### `populate-data.sql`
- **Purpose**: Creates realistic test data
- **Users**: 10 authenticated users across skill levels
- **Games**: 20+ sessions with varied performance
- **Security**: Excludes Guest ID 000000

### `data-validation.sql`
- **Purpose**: Verifies data integrity
- **Checks**: User distribution, game stats, performance
- **Results**: Confirms data quality and relationships

### `cleanup-data.sql`
- **Purpose**: Removes all test data
- **Safety**: Preserves Guest user functionality
- **Options**: Selective or complete cleanup

## Execution Order

1. **Run populate-data.sql** first
2. **Run data-validation.sql** to verify
3. **Use leaderboard** to test functionality
4. **Run cleanup-data.sql** when needed

## Important Notes

### Guest User Handling
- **ID '000000'** is hardcoded for guests
- **Never populate** this ID with test data
- **Security separation** between guest/auth users

### Data Characteristics
- **Skill Levels**: Beginner, Intermediate, Advanced, Expert
- **Score Ranges**: Realistic progression
- **Time Performance**: Varied completion times
- **Device Types**: Desktop, mobile, tablet

### Testing Checklist
- [ ] Leaderboard shows populated users
- [ ] Guest entries excluded from results  
- [ ] Search works with new data
- [ ] Pagination functions correctly
- [ ] Player profiles display properly
- [ ] Game statistics accurate

## Troubleshooting

### Common Issues
- **Foreign key errors**: Run users table first
- **Permission denied**: Check SQL editor permissions
- **Script timeout**: Run in smaller batches

### Support
1. Check Supabase documentation
2. Review error messages in SQL editor
3. Test with individual queries first
4. Verify table schema matches expectations

Your database will now be populated with comprehensive test data for development while maintaining proper Guest user separation.
