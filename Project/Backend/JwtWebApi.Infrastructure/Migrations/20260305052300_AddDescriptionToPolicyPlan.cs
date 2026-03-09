using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JwtWebApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDescriptionToPolicyPlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "PolicyPlans",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "PolicyPlans");
        }
    }
}
